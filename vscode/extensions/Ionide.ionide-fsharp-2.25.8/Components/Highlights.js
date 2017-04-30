"use strict";

exports.__esModule = true;
exports.activate = activate;

var _Utils = require("./../Core/Utils");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _LanguageService = require("./../Core/LanguageService");

var _fableCore = require("fable-core");

var _vscode = require("vscode");

function createProvider() {
  var _ref;

  var mapResult = function mapResult(o) {
    return _Utils.Utils.isNotNull(o) ? Array.from(o.Data.Uses.map(function (d) {
      var res = {};
      res.range = _Utils.CodeRange.fromSymbolUse(d);
      res.kind = 0;
      return res;
    })) : [];
  };

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.DocumentHighlightProvider"], _ref.provideDocumentHighlights = function provideDocumentHighlights(doc, pos, ct) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg1) {
        return _Helpers.Promise.lift(mapResult(_arg1));
      }, (0, _LanguageService.symbolUse)(doc.fileName, (pos.line + 0x80000000 >>> 0) - 0x80000000 + 1, (pos.character + 0x80000000 >>> 0) - 0x80000000 + 1));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref;
}

function activate(selector, disposables) {
  _vscode.languages.registerDocumentHighlightProvider(selector, createProvider());
}