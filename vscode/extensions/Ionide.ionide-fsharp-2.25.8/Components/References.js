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
    return function (o) {
      return _Utils.Utils.isNotNull(o) ? Array.from(o.Data.Uses.map(function (s) {
        var loc = {};
        loc.range = _Utils.CodeRange.fromSymbolUse(s);
        loc.uri = _vscode.Uri.file(s.FileName);
        return loc;
      })) : [];
    };
  };

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.ReferenceProvider"], _ref.provideReferences = function provideReferences(doc, pos, _arg1, _arg2) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg3) {
        return _Helpers.Promise.lift(mapResult(doc)(_arg3));
      }, (0, _LanguageService.symbolUseProject)(doc.fileName, (pos.line + 0x80000000 >>> 0) - 0x80000000 + 1, (pos.character + 0x80000000 >>> 0) - 0x80000000 + 1));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref;
}

function activate(selector, disposables) {
  _vscode.languages.registerReferenceProvider(selector, createProvider());
}