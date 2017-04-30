"use strict";

exports.__esModule = true;
exports.ifDiagnostic = ifDiagnostic;
exports.upercaseDU = upercaseDU;
exports.applyQuickFix = applyQuickFix;
exports.applyRenameFix = applyRenameFix;
exports.activate = activate;

var _fableCore = require("fable-core");

var _vscode = require("vscode");

var _Helpers = require("./../fable_external/Helpers-729269674");

function mkCommand(name, document, range, title, suggestion) {
  var cmd = {};
  cmd.title = title;
  cmd.command = name;
  cmd.arguments = [document, range, suggestion];
  return cmd;
}

var mkQuickFix = function () {
  var name = "fsharp.quickFix";
  return function (document) {
    return function (range) {
      return function (title) {
        return function (suggestion) {
          return mkCommand(name, document, range, title, suggestion);
        };
      };
    };
  };
}();

var mkRenameFix = function () {
  var name = "fsharp.renameFix";
  return function (document) {
    return function (range) {
      return function (title) {
        return function (suggestion) {
          return mkCommand(name, document, range, title, suggestion);
        };
      };
    };
  };
}();

function ifDiagnostic(selector, f, diagnostics) {
  var diagnostic = _fableCore.Seq.tryFind(function (d) {
    return d.message.indexOf(selector) >= 0;
  }, diagnostics);

  if (diagnostic != null) {
    return f(diagnostic);
  } else {
    return [];
  }
}

function getSuggestions(doc, diagnostics) {
  return ifDiagnostic("Maybe you want one of the following:", function (d) {
    return d.message.split("\n").slice(1, d.message.split("\n").length).map(function (suggestion) {
      var s = _fableCore.String.trim(suggestion, "both");

      var tiltle = _fableCore.String.fsFormat("Replace with %s")(function (x) {
        return x;
      })(s);

      return mkQuickFix(doc)(d.range)(tiltle)(s);
    });
  }, diagnostics);
}

function getNewKeywordSuggestions(doc, diagnostics) {
  return ifDiagnostic("It is recommended that objects supporting the IDisposable interface are created using the syntax", function (d) {
    var s = "new " + doc.getText(d.range);
    return [mkQuickFix(doc)(d.range)("Add new")(s)];
  }, diagnostics);
}

function fixUnused(doc, diagnostics) {
  return ifDiagnostic("is unused", function (d) {
    var s = "_";
    var s2 = "_" + doc.getText(d.range);
    return [mkQuickFix(doc)(d.range)("Replace with _")(s), mkQuickFix(doc)(d.range)("Prefix with _")(s2)];
  }, diagnostics);
}

function upercaseDU(doc, diagnostics) {
  return ifDiagnostic("Discriminated union cases and exception labels must be uppercase identifiers", function (d) {
    var s = doc.getText(d.range).split("");
    var c = s[0].toUpperCase();
    var chars = Array.from(_fableCore.Seq.delay(function () {
      return _fableCore.Seq.append(_fableCore.Seq.singleton(c), _fableCore.Seq.delay(function () {
        return s.slice(1, s.length);
      }));
    }));
    var s_1 = chars.join('');
    return [mkRenameFix(doc)(d.range)(_fableCore.String.fsFormat("Replace with %s")(function (x) {
      return x;
    })(s_1))(s_1)];
  }, diagnostics);
}

function createProvider() {
  var _ref;

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.CodeActionProvider"], _ref.provideCodeActions = function provideCodeActions(doc, range, context, ct) {
    var diagnostics = context.diagnostics;
    return Array.from(Array.from(_fableCore.Seq.collect(function (f) {
      return f(doc)(diagnostics);
    }, [function (doc_1) {
      return function (diagnostics_1) {
        return getSuggestions(doc_1, diagnostics_1);
      };
    }, function (doc_1) {
      return function (diagnostics_1) {
        return getNewKeywordSuggestions(doc_1, diagnostics_1);
      };
    }, function (doc_1) {
      return function (diagnostics_1) {
        return fixUnused(doc_1, diagnostics_1);
      };
    }, function (doc_1) {
      return function (diagnostics_1) {
        return upercaseDU(doc_1, diagnostics_1);
      };
    }])));
  }, _ref;
}

function applyQuickFix(doc, range, suggestion) {
  var edit = new _vscode.WorkspaceEdit();

  var uri = _vscode.Uri.file(doc.fileName);

  edit.replace(uri, range, suggestion);
  return _vscode.workspace.applyEdit(edit);
}

function applyRenameFix(doc, range, suggestion) {
  return _Helpers.Promise.bind(function (arg00) {
    return _vscode.workspace.applyEdit(arg00);
  }, _vscode.commands.executeCommand("vscode.executeDocumentRenameProvider", _vscode.Uri.file(doc.fileName), range.start, suggestion));
}

function activate(selector, disposables) {
  _vscode.languages.registerCodeActionsProvider(selector, createProvider());

  _vscode.commands.registerCommand("fsharp.quickFix", function (a, b, c) {
    return applyQuickFix(a, b, c);
  });

  _vscode.commands.registerCommand("fsharp.renameFix", function (a, b, c) {
    return applyRenameFix(a, b, c);
  });
}