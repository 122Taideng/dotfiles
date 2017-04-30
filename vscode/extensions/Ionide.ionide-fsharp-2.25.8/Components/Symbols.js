"use strict";

exports.__esModule = true;
exports.activate = activate;

var _Utils = require("./../Core/Utils");

var _fableCore = require("fable-core");

var _vscode = require("vscode");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _LanguageService = require("./../Core/LanguageService");

function createProvider() {
  var _ref;

  var convertToKind = function convertToKind(code) {
    var $var14 = null;

    switch (code) {
      case "C":
        $var14 = 4;
        break;

      case "E":
        $var14 = 9;
        break;

      case "S":
        $var14 = 6;
        break;

      case "I":
        $var14 = 10;
        break;

      case "N":
        $var14 = 1;
        break;

      case "M":
        $var14 = 5;
        break;

      case "P":
        $var14 = 6;
        break;

      case "F":
        $var14 = 12;
        break;

      case "T":
        $var14 = 4;
        break;

      case "Fc":
        $var14 = 11;
        break;

      default:
        $var14 = 0;
    }

    return $var14;
  };

  var mapRes = function mapRes(doc) {
    return function (o) {
      return _Utils.Utils.isNotNull(o) ? Array.from(_fableCore.Seq.concat(o.Data.map(function (syms) {
        var oc = {};
        oc.name = syms.Declaration.Name;
        oc.kind = convertToKind(syms.Declaration.GlyphChar);
        oc.containerName = syms.Declaration.Glyph;
        var loc = {};
        loc.range = _Utils.CodeRange.fromDTO(syms.Declaration.BodyRange);
        loc.uri = _vscode.Uri.file(doc.fileName);
        oc.location = loc;
        var ocs = syms.Nested.map(function (sym) {
          var oc_1 = {};
          oc_1.name = sym.Name;
          oc_1.kind = convertToKind(sym.GlyphChar);
          oc_1.containerName = sym.Glyph;
          var loc_1 = {};
          loc_1.range = _Utils.CodeRange.fromDTO(sym.BodyRange);
          loc_1.uri = _vscode.Uri.file(doc.fileName);
          oc_1.location = loc_1;
          return oc_1;
        });
        return Array.from(_fableCore.Seq.replicate(1, oc)).concat(ocs);
      }))) : [];
    };
  };

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.DocumentSymbolProvider"], _ref.provideDocumentSymbols = function provideDocumentSymbols(doc, ct) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg1) {
        var data = mapRes(doc)(_arg1);
        return _Helpers.Promise.lift(Array.from(data));
      }, (0, _LanguageService.declarations)(doc.fileName, doc.version));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref;
}

function activate(selector, disposables) {
  _vscode.languages.registerDocumentSymbolProvider(selector, createProvider());
}