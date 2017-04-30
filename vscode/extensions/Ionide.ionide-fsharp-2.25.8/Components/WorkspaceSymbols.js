"use strict";

exports.__esModule = true;
exports.activate = activate;

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _vscode = require("vscode");

var _Utils = require("./../Core/Utils");

var _fableCore = require("fable-core");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _LanguageService = require("./../Core/LanguageService");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createProvider() {
  var _ref;

  var convertToKind = function convertToKind(code) {
    var $var15 = null;

    switch (code) {
      case "C":
        $var15 = 4;
        break;

      case "E":
        $var15 = 9;
        break;

      case "S":
        $var15 = 6;
        break;

      case "I":
        $var15 = 10;
        break;

      case "N":
        $var15 = 1;
        break;

      case "M":
        $var15 = 5;
        break;

      case "P":
        $var15 = 6;
        break;

      case "F":
        $var15 = 12;
        break;

      case "T":
        $var15 = 4;
        break;

      default:
        $var15 = 0;
    }

    return $var15;
  };

  var relative = function relative(f) {
    return path.relative(_vscode.workspace.rootPath, f);
  };

  var mapRes = function mapRes(o) {
    return _Utils.Utils.isNotNull(o) ? Array.from(_fableCore.Seq.concat(o.Data.map(function (syms) {
      var oc = {};
      oc.name = syms.Declaration.Name;
      oc.kind = convertToKind(syms.Declaration.GlyphChar);
      oc.containerName = relative(syms.Declaration.File);
      var loc = {};
      loc.range = _Utils.CodeRange.fromDTO(syms.Declaration.BodyRange);
      loc.uri = _vscode.Uri.file(syms.Declaration.File);
      oc.location = loc;
      var ocs = syms.Nested.map(function (sym) {
        var oc_1 = {};
        oc_1.name = sym.Name;
        oc_1.kind = convertToKind(sym.GlyphChar);
        oc_1.containerName = relative(sym.File);
        var loc_1 = {};
        loc_1.range = _Utils.CodeRange.fromDTO(sym.BodyRange);
        loc_1.uri = _vscode.Uri.file(sym.File);
        oc_1.location = loc_1;
        return oc_1;
      });
      return Array.from(_fableCore.Seq.replicate(1, oc)).concat(ocs);
    }))) : [];
  };

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.WorkspaceSymbolProvider"], _ref.provideWorkspaceSymbols = function provideWorkspaceSymbols(q, ct) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg1) {
        return _Helpers.Promise.lift(Array.from(mapRes(_arg1)));
      }, (0, _LanguageService.declarationsProjects)());
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref;
}

function activate(selector, disposables) {
  _vscode.languages.registerWorkspaceSymbolProvider(createProvider());
}