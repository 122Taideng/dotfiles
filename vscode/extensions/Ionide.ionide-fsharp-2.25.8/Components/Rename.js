"use strict";

exports.__esModule = true;
exports.activate = activate;

var _vscode = require("vscode");

var _Utils = require("./../Core/Utils");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _LanguageService = require("./../Core/LanguageService");

var _fableCore = require("fable-core");

function createProvider() {
  var _ref;

  var mapResult = function mapResult(doc) {
    return function (newName) {
      return function (o) {
        var res = new _vscode.WorkspaceEdit();

        if (_Utils.Utils.isNotNull(o)) {
          o.Data.Uses.forEach(function (s) {
            var range = new _vscode.Range(s.StartLine - 1, s.EndColumn - o.Data.Name.length - 1, s.EndLine - 1, s.EndColumn - 1);

            var te = _vscode.TextEdit.replace(range, newName);

            var uri = _vscode.Uri.file(s.FileName);

            res.replace(uri, range, newName);
          });
        }

        return res;
      };
    };
  };

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.RenameProvider"], _ref.provideRenameEdits = function provideRenameEdits(doc, pos, newName, _arg1) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg2) {
        return _Helpers.Promise.lift(mapResult(doc)(newName)(_arg2));
      }, (0, _LanguageService.symbolUseProject)(doc.fileName, (pos.line + 0x80000000 >>> 0) - 0x80000000 + 1, (pos.character + 0x80000000 >>> 0) - 0x80000000 + 1));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref;
}

function activate(selector, disposables) {
  _vscode.languages.registerRenameProvider(selector, createProvider());
}