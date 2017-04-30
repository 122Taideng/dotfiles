"use strict";

exports.__esModule = true;
exports.invokeMSBuild = invokeMSBuild;
exports.buildCurrentProject = buildCurrentProject;
exports.buildProject = buildProject;
exports.activate = activate;

var _vscode = require("vscode");

var _Logging = require("./../Core/Logging");

var _fableCore = require("fable-core");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _Environment = require("./Environment");

var _Utils = require("./../Core/Utils");

var _Project = require("./../Core/Project");

var outputChannel = _vscode.window.createOutputChannel("msbuild");

var logger = new _Logging.ConsoleAndOutputChannelLogger("msbuild", new _Logging.Level("DEBUG", []), outputChannel, new _Logging.Level("DEBUG", []));

function invokeMSBuild(project, target) {
  var autoshow = function () {
    var cfg = _vscode.workspace.getConfiguration();

    return cfg.get("FSharp.msbuildAutoshow", true);
  }();

  var safeproject = _fableCore.String.fsFormat("\"%s\"")(function (x) {
    return x;
  })(project);

  var command = _fableCore.String.fsFormat("%s /t:%s")(function (x) {
    return x;
  })(safeproject)(target);

  (function (builder_) {
    return _Helpers.Promise.bind(function (_arg1) {
      logger.Debug("invoking msbuild from %s on %s for target %s", _arg1, safeproject, target);

      _Helpers.Process.spawnWithNotification(_arg1, "", command, outputChannel);

      if (autoshow) {
        outputChannel.show();
        return Promise.resolve();
      } else {
        return Promise.resolve();
      }
    }, _Environment.msbuild);
  })(_Helpers.PromiseBuilderImp.promise);
}

function buildCurrentProject(target) {
  logger.Debug("discovering project");
  var matchValue = _vscode.window.activeTextEditor.document;

  var $target0 = function $target0() {
    var currentProject = _fableCore.Seq.tryHead(_fableCore.Seq.where(function (p) {
      return _fableCore.Seq.exists(function () {
        var ending = _vscode.window.activeTextEditor.document.fileName;
        return function (s) {
          return _Utils.String.endWith(ending, s);
        };
      }(), p.Files);
    }, (0, _Project.getLoaded)()));

    if (currentProject == null) {
      logger.Debug("could not find a project that contained the file %s", _vscode.window.activeTextEditor.document.fileName);
    } else {
      logger.Debug("found project %s", currentProject.Project);
      invokeMSBuild(currentProject.Project, target);
    }
  };

  {
    var activePatternResult2916 = _Utils.Document.$FSharp$CSharp$VB$Other$(matchValue);

    if (activePatternResult2916.Case === "Choice2Of4") {
      $target0();
    } else {
      if (activePatternResult2916.Case === "Choice3Of4") {
        $target0();
      } else {
        if (activePatternResult2916.Case === "Choice4Of4") {
          logger.Debug("I don't know how to handle a project of type %s", _vscode.window.activeTextEditor.document.languageId);
        } else {
          $target0();
        }
      }
    }
  }
}

function buildProject(target) {
  return function (builder_) {
    logger.Debug("building project");
    var projects = Array.from((0, _Project.getAll)());

    if (projects.length !== 0) {
      var opts = {};
      opts.placeHolder = "Project to build";
      return _Helpers.Promise.bind(function (_arg1) {
        logger.Debug("user chose project %s", _arg1);

        if (_arg1 != undefined) {
          invokeMSBuild(_arg1, target);
          return Promise.resolve();
        } else {
          return Promise.resolve();
        }
      }, _vscode.window.showQuickPick(projects, opts));
    } else {
      return Promise.resolve();
    }
  }(_Helpers.PromiseBuilderImp.promise);
}

function activate(disposables) {
  var registerCommand = function registerCommand(com) {
    return function (action) {
      _vscode.commands.registerCommand(com, action);
    };
  };

  _Helpers.Promise.map(function (p) {
    logger.Debug("MSBuild found at %s", p);
    logger.Debug("MSBuild activated");
  }, _Environment.msbuild);

  registerCommand("MSBuild.buildCurrent")(function () {
    buildCurrentProject("Build");
  });
  registerCommand("MSBuild.buildSelected")(function () {
    return buildProject("Build");
  });
  registerCommand("MSBuild.rebuildCurrent")(function () {
    buildCurrentProject("Rebuild");
  });
  registerCommand("MSBuild.rebuildSelected")(function () {
    return buildProject("Rebuild");
  });
  registerCommand("MSBuild.cleanCurrent")(function () {
    buildCurrentProject("Clean");
  });
  registerCommand("MSBuild.cleanSelected")(function () {
    return buildProject("Clean");
  });
}