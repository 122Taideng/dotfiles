"use strict";

exports.__esModule = true;
exports.activate = activate;

var _vscode = require("vscode");

var _Utils = require("./../Core/Utils");

var _fableCore = require("fable-core");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _LanguageService = require("./../Core/LanguageService");

var currentDiagnostic = _vscode.languages.createDiagnosticCollection();

var fixes = [];

function isLinterEnabled() {
  return _Utils.Configuration.get(true, "FSharp.linter");
}

function diagnosticFromLintWarning(file, warning) {
  var range = _Utils.CodeRange.fromDTO(warning.Range);

  var loc = new _vscode.Location(_vscode.Uri.file(file), range);
  return [new _vscode.Diagnostic(range, "Lint: " + warning.Info, 2), file];
}

function mapResult(file, ev) {
  return _Utils.Utils.isNotNull(ev) ? Array.from(_fableCore.Seq.map(function (warning) {
    return diagnosticFromLintWarning(file, warning);
  }, ev.Data)) : [];
}

function lintDocument(path) {
  fixes.splice(0);
  return _Helpers.Promise.onSuccess(function (ev) {
    if (_Utils.Utils.isNotNull(ev)) {
      (function (arg00) {
        _fableCore.Array.addRangeInPlace(arg00, fixes);
      })(Array.from(_fableCore.Seq.where(function (a) {
        return _Utils.Utils.isNotNull(a.Fix);
      }, ev.Data)).map(function (a) {
        return a.Fix;
      }));

      (function (tupledArg) {
        currentDiagnostic.set(tupledArg[0], tupledArg[1]);
      })([_vscode.Uri.file(path), Array.from(_fableCore.Seq.map(function (tuple) {
        return tuple[0];
      }, mapResult(path, ev)))]);
    }
  }, (0, _LanguageService.lint)(path));
}

var timer = null;

function handler(event) {
  _fableCore.Seq.iterate(function (timer_1) {
    clearTimeout(timer_1);
  }, function () {
    var $var34 = timer;

    if ($var34 != null) {
      return [$var34];
    } else {
      return [];
    }
  }());

  var matchValue = event.document;

  var $target1 = function $target1() {};

  {
    var activePatternResult2589 = _Utils.Document.$FSharp$CSharp$VB$Other$(matchValue);

    if (activePatternResult2589.Case === "Choice1Of4") {
      if (isLinterEnabled()) {
        timer = setTimeout(function (_arg1) {
          lintDocument(event.document.fileName);
        }, 1000);
      } else {
        $target1();
      }
    } else {
      $target1();
    }
  }
}

function handlerOpen(event) {
  if (event != undefined) {
    var matchValue = event.document;

    var $target1 = function $target1() {};

    {
      var activePatternResult2592 = _Utils.Document.$FSharp$CSharp$VB$Other$(matchValue);

      if (activePatternResult2592.Case === "Choice1Of4") {
        if (isLinterEnabled()) {
          lintDocument(event.document.fileName);
        } else {
          $target1();
        }
      } else {
        $target1();
      }
    }
  }
}

function createProvider() {
  var _ref;

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.CodeActionProvider"], _ref.provideCodeActions = function provideCodeActions(doc, range, context, ct) {
    var diagnostics = context.diagnostics;

    var diagnostic = _fableCore.Seq.tryFind(function (d) {
      return d.message.indexOf("Lint:") >= 0;
    }, diagnostics);

    var res = diagnostic != null ? Array.from(_fableCore.Seq.map(function (suggestion) {
      var cmd = {};
      cmd.title = _fableCore.String.fsFormat("Replace with %s")(function (x) {
        return x;
      })(suggestion.ToText);
      cmd.command = "fsharp.lintFix";
      cmd.arguments = [doc, diagnostic.range, suggestion.ToText];
      return cmd;
    }, _fableCore.Seq.where(function (f) {
      return ((f.FromRange.StartColumn === diagnostic.range.start.character + 1 ? f.FromRange.EndColumn === diagnostic.range.end.character + 1 : false) ? f.FromRange.StartLine === diagnostic.range.start.line + 1 : false) ? f.FromRange.EndLine === diagnostic.range.end.line + 1 : false;
    }, fixes))) : [];
    return Array.from(res);
  }, _ref;
}

function applyQuickFix(doc, range, suggestion) {
  var edit = new _vscode.WorkspaceEdit();

  var uri = _vscode.Uri.file(doc.fileName);

  edit.replace(uri, range, suggestion);
  return _vscode.workspace.applyEdit(edit);
}

function activate(selector, disposables) {
  _vscode.workspace.onDidChangeTextDocument(function (event) {
    handler(event);
  }, null, disposables);

  _vscode.window.onDidChangeActiveTextEditor(function (event) {
    handlerOpen(event);
  }, null, disposables);

  _fableCore.Seq.iterate(function (event) {
    handlerOpen(event);
  }, _vscode.window.visibleTextEditors);

  _vscode.languages.registerCodeActionsProvider(selector, createProvider());

  _vscode.commands.registerCommand("fsharp.lintFix", function (a, b, c) {
    return applyQuickFix(a, b, c);
  });
}