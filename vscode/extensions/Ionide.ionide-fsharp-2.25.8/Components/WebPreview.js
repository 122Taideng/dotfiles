"use strict";

exports.__esModule = true;
exports.fakeProcess = exports.startingPage = exports.parameters = exports.startString = exports.build = exports.script = exports.port = exports.host = exports.command = exports.linuxPrefix = undefined;
exports.loadSettings = loadSettings;
exports.parseResponse = parseResponse;
exports.close = close;
exports.show = show;
exports.activate = activate;

var _vscode = require("vscode");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _fableCore = require("fable-core");

var _Utils = require("./../Core/Utils");

var previewUri = _vscode.Uri.parse("webpreview://preview");

var eventEmitter = new _vscode.EventEmitter();
var update = eventEmitter.event;
var linuxPrefix = exports.linuxPrefix = "";
var command = exports.command = "packages/FAKE/tools/FAKE.exe";
var host = exports.host = "";
var port = exports.port = 8083;
var script = exports.script = "";
var build = exports.build = "";
var startString = exports.startString = "";
var parameters = exports.parameters = [];
var startingPage = exports.startingPage = "";
var fakeProcess = exports.fakeProcess = null;

function loadSettings() {
  exports.linuxPrefix = linuxPrefix = _Helpers.Settings.loadOrDefault(function (s) {
    return s.WebPreview.linuxPrefix;
  }, "mono");
  exports.command = command = _Helpers.Settings.loadOrDefault(function (s) {
    return s.WebPreview.command;
  }, "packages/FAKE/tools/FAKE.exe");
  exports.host = host = _Helpers.Settings.loadOrDefault(function (s) {
    return s.WebPreview.host;
  }, "localhost");
  exports.port = port = _Helpers.Settings.loadOrDefault(function (s) {
    return s.WebPreview.port;
  }, 8888);
  exports.script = script = _Helpers.Settings.loadOrDefault(function (s) {
    return s.WebPreview.script;
  }, "build.fsx");
  exports.build = build = _Helpers.Settings.loadOrDefault(function (s) {
    return s.WebPreview.build;
  }, "Serve");
  exports.startString = startString = _Helpers.Settings.loadOrDefault(function (s) {
    return s.WebPreview.startString;
  }, "listener started");
  exports.parameters = parameters = _Helpers.Settings.loadOrDefault(function (s) {
    return s.WebPreview.parameters;
  }, []);
  exports.startingPage = startingPage = _Helpers.Settings.loadOrDefault(function (s) {
    return s.WebPreview.startingPage;
  }, "");
}

function createProvider() {
  var _p;

  var generate = function generate() {
    var src = _fableCore.String.fsFormat("http://%s:%d/%s")(function (x) {
      return x;
    })(host)(port)(startingPage);

    var style = "height: 100%; width: 100%; background-color: white;";
    return _fableCore.String.fsFormat("<iframe style='%s' src='%s' />")(function (x) {
      return x;
    })(style)(src);
  };

  var v = eventEmitter.event;
  var p = (_p = {}, _p[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.TextDocumentContentProvider"], _p.provideTextDocumentContent = function provideTextDocumentContent() {
    return generate();
  }, _p);
  p.onDidChange = eventEmitter.event;
  return p;
}

function parseResponse(o) {
  if (o != undefined ? _Utils.Utils.isNotNull(o) : false) {
    var str = _fableCore.Util.toString(o);

    if (str.indexOf(startString) >= 0) {
      _vscode.commands.executeCommand("vscode.previewHtml", previewUri, 2);
    }
  }
}

function close() {
  try {
    _fableCore.Seq.iterate(function (p) {
      p.kill();
      exports.fakeProcess = fakeProcess = null;
    }, function () {
      var $var31 = fakeProcess;

      if ($var31 != null) {
        return [$var31];
      } else {
        return [];
      }
    }());
  } catch (matchValue) {}
}

function show() {
  loadSettings();

  if (function () {
    return fakeProcess != null;
  }()) {
    close();
  }

  var cp = function () {
    var args = _fableCore.String.fsFormat("%s %s port=%d")(function (x) {
      return x;
    })(script)(build)(port);

    var args_ = function () {
      var folder = function folder(acc) {
        return function (e) {
          return acc + " " + e;
        };
      };

      return function (array) {
        return _fableCore.Seq.fold(function ($var32, $var33) {
          return folder($var32)($var33);
        }, args, array);
      };
    }()(parameters);

    return _Helpers.Process.spawn(command, linuxPrefix, args_);
  }();

  cp.stdout.on("readable", function (n) {
    parseResponse(cp.stdout.read());
  });
  cp.stderr.on("readable", function (o) {
    if (o != undefined ? _Utils.Utils.isNotNull(o) : false) {
      console.error(_fableCore.Util.toString(o));
    }
  }(cp.stdout.read()));
  exports.fakeProcess = fakeProcess = cp;
}

function activate(disposables) {
  var prov = createProvider();

  _vscode.workspace.registerTextDocumentContentProvider("webpreview", prov);

  _vscode.commands.registerCommand("webpreview.Show", function () {
    show();
  });

  _vscode.commands.registerCommand("webpreview.Refresh", function (_arg1) {
    eventEmitter.fire(previewUri);
  });
}