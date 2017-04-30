"use strict";

exports.__esModule = true;
exports.insertText = insertText;
exports.activate = activate;

var _fableCore = require("fable-core");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _LanguageService = require("./../Core/LanguageService");

var _vscode = require("vscode");

function createProvider() {
  var _ref;

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.CodeActionProvider"], _ref.provideCodeActions = function provideCodeActions(doc, range, context, ct) {
    return function (builder_) {
      var diagnostic = _fableCore.Seq.tryFind(function (d) {
        return d.message.indexOf("Incomplete pattern matches on this expression. For example") >= 0;
      }, context.diagnostics);

      return _Helpers.Promise.bind(function (_arg2) {
        return _Helpers.Promise.lift(Array.from(_arg2));
      }, diagnostic != null ? function (builder__1) {
        var line = (range.start.line + 0x80000000 >>> 0) - 0x80000000 + 2;
        var col = doc.getText().split("\n")[line - 1].indexOf("|") + 3;
        return _Helpers.Promise.bind(function (_arg1) {
          var cmd = {};
          cmd.title = "Generate union pattern match case";
          cmd.command = "fsharp.insertUnionCases";
          cmd.arguments = [doc, _arg1.Data.Text, _arg1.Data.Position];
          return _Helpers.Promise.lift([cmd]);
        }, (0, _LanguageService.unionCaseGenerator)(doc.fileName, line, col));
      }(_Helpers.PromiseBuilderImp.promise) : function (builder__1) {
        return _Helpers.Promise.lift([]);
      }(_Helpers.PromiseBuilderImp.promise));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref;
}

function insertText(doc, text, pos) {
  var edit = new _vscode.WorkspaceEdit();

  var uri = _vscode.Uri.file(doc.fileName);

  var position = new _vscode.Position(pos.Line - 1, pos.Col);

  var text_1 = _fableCore.String.replace(text, "$1", "failwith \"Not Implemented\"");

  edit.insert(uri, position, text_1);
  return _vscode.workspace.applyEdit(edit);
}

function activate(selector, disposables) {
  _vscode.languages.registerCodeActionsProvider(selector, createProvider());

  _vscode.commands.registerCommand("fsharp.insertUnionCases", function (a, b, c) {
    return insertText(a, b, c);
  });
}