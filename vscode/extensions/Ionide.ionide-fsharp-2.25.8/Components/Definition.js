"use strict";

exports.__esModule = true;
exports.activate = activate;

var _Utils = require("./../Core/Utils");

var _vscode = require("vscode");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _LanguageService = require("./../Core/LanguageService");

var _fableCore = require("fable-core");

function createProvider() {
  var _ref;

  var mapResult = function mapResult(doc) {
    return function (pos) {
      return function (o) {
        return _Utils.Utils.isNotNull(o) ? function () {
          var loc = {};
          var range = doc.getWordRangeAtPosition(pos);
          var length = range.end.character - range.start.character;
          loc.uri = _vscode.Uri.file(o.Data.File);
          loc.range = _Utils.CodeRange.fromDeclaration(o.Data, length);
          return loc;
        }() : {};
      };
    };
  };

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.DefinitionProvider"], _ref.provideDefinition = function provideDefinition(doc, pos, ct) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg1) {
        return _Helpers.Promise.lift(mapResult(doc)(pos)(_arg1));
      }, (0, _LanguageService.findDeclaration)(doc.fileName, (pos.line + 0x80000000 >>> 0) - 0x80000000 + 1, (pos.character + 0x80000000 >>> 0) - 0x80000000 + 1));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref;
}

function activate(selector, disposables) {
  _vscode.languages.registerDefinitionProvider(selector, createProvider());
}