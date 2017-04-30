"use strict";

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.activate = activate;

var _vscode = require("vscode");

var _fableCore = require("fable-core");

var _Utils = require("./../Core/Utils");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _CodeLens = require("./CodeLens");

var _LanguageService = require("./../Core/LanguageService");

var _Project = require("./../Core/Project");

var currentDiagnostic = _vscode.languages.createDiagnosticCollection();

function mapResult(ev) {
  var errors = Array.from(_fableCore.Seq.choose(function (error) {
    try {
      if (_Utils.String.startWith("\\", _vscode.window.activeTextEditor.document.fileName)) {
        return null;
      } else {
        var range = _Utils.CodeRange.fromError(error);

        var loc = new _vscode.Location(_vscode.Uri.file(error.FileName), range);
        var severity = error.Severity === "Error" ? 0 : 1;
        return [new _vscode.Diagnostic(range, error.Message, severity), error.FileName];
      }
    } catch (matchValue) {
      return null;
    }
  }, _fableCore.Seq.distinctBy(function (error) {
    return [error.Severity, error.StartLine, error.StartColumn];
  }, ev.Data.Errors)));
  return [ev.Data.File, errors];
}

function parse(path, text, version) {
  return _Helpers.Promise.map(function (ev) {
    if (_Utils.Utils.isNotNull(ev)) {
      _CodeLens.refresh.fire(version);

      (function (tupledArg) {
        currentDiagnostic.set(tupledArg[0], tupledArg[1]);
      })([_vscode.Uri.file(path), Array.from(_fableCore.Seq.map(function (tuple) {
        return tuple[0];
      }, mapResult(ev)[1]))]);
    }
  }, (0, _LanguageService.parse)(path, text, version));
}

function parseFile(file) {
  var activePatternResult2790 = _Utils.Document.$FSharp$CSharp$VB$Other$(file);

  if (activePatternResult2790.Case === "Choice1Of4") {
    var _ret = function () {
      var path = file.fileName;
      var prom = (0, _Project.find)(path);

      if (prom == null) {
        return {
          v: parse(path, file.getText(), file.version)
        };
      } else {
        return {
          v: _Helpers.Promise.bind(function (_arg1) {
            return parse(path, file.getText(), file.version);
          }, (0, _Project.load)(prom))
        };
      }
    }();

    if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
  } else {
    return _Helpers.Promise.lift();
  }
}

var timer = null;

function handler(event) {
  _fableCore.Seq.iterate(function (timer_1) {
    clearTimeout(timer_1);
  }, function () {
    var $var36 = timer;

    if ($var36 != null) {
      return [$var36];
    } else {
      return [];
    }
  }());

  timer = setTimeout(function (_arg1) {
    var matchValue = event.document;

    var activePatternResult2793 = _Utils.Document.$FSharp$CSharp$VB$Other$(matchValue);

    if (activePatternResult2793.Case === "Choice1Of4") {
      return parse(event.document.fileName, event.document.getText(), event.document.version);
    } else {
      return function (builder_) {
        return Promise.resolve();
      }(_Helpers.PromiseBuilderImp.promise);
    }
  }, 1000);
}

function handlerSave(doc) {
  var activePatternResult2800 = _Utils.Document.$FSharp$CSharp$VB$Other$(doc);

  if (activePatternResult2800.Case === "Choice1Of4") {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg1) {
        return _Utils.Utils.isNotNull(_arg1) ? function () {
          var patternInput = mapResult(_arg1);
          currentDiagnostic.clear();

          _fableCore.Seq.iterate(function (tupledArg) {
            var errs = Array.from(_fableCore.Seq.map(function (tuple) {
              return tuple[0];
            }, tupledArg[1]));
            currentDiagnostic.set(_vscode.Uri.file(tupledArg[0]), errs);
          }, _fableCore.Seq.groupBy(function (tuple) {
            return tuple[1];
          }, patternInput[1]));

          return Promise.resolve();
        }() : Promise.resolve();
      }, (0, _LanguageService.parseProjects)(doc.fileName));
    }(_Helpers.PromiseBuilderImp.promise);
  } else {
    return _Helpers.Promise.empty();
  }
}

function handlerOpen(event) {
  return event != undefined ? parseFile(event.document) : _Helpers.Promise.lift();
}

function activate(disposables) {
  _vscode.workspace.onDidChangeTextDocument(function (event) {
    handler(event);
  }, null, disposables);

  _vscode.workspace.onDidSaveTextDocument(function (doc) {
    return handlerSave(doc);
  }, null, disposables);

  _vscode.window.onDidChangeActiveTextEditor(function (event) {
    return handlerOpen(event);
  }, null, disposables);

  var matchValue = _fableCore.Seq.toList(_vscode.window.visibleTextEditors);

  if (matchValue.tail != null) {
    if (matchValue.tail.tail == null) {
      var _ret2 = function () {
        var x = matchValue.head;
        return {
          v: _Helpers.Promise.bind(function () {
            return handlerSave(x.document);
          }, parseFile(x.document))
        };
      }();

      if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
    } else {
      var _ret3 = function () {
        var tail = matchValue.tail;
        var x = matchValue.head;
        return {
          v: _Helpers.Promise.bind(function () {
            return handlerSave(x.document);
          }, _fableCore.Seq.fold(function (acc, e) {
            return _Helpers.Promise.bind(function () {
              return parseFile(e.document);
            }, acc);
          }, parseFile(x.document), tail))
        };
      }();

      if ((typeof _ret3 === "undefined" ? "undefined" : _typeof(_ret3)) === "object") return _ret3.v;
    }
  } else {
    return _Helpers.Promise.lift();
  }
}