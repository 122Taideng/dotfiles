"use strict";

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.activate = activate;

var _vscode = require("vscode");

var _Utils = require("./../Core/Utils");

var _fableCore = require("fable-core");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _LanguageService = require("./../Core/LanguageService");

function createProvider() {
  var _ref;

  var mapResult = function mapResult(o) {
    var res = new _vscode.SignatureHelp();

    if (_Utils.Utils.isNotNull(o)) {
      var sigs = Array.from(Array.from(_fableCore.Seq.choose(function (c) {
        try {
          var _ret = function () {
            var tip = c.Tip[0][0];
            var signature = new _vscode.SignatureInformation(tip.Signature, tip.Comment);
            c.Parameters.forEach(function (p) {
              var parameter = new _vscode.ParameterInformation(p.Name, p.CanonicalTypeTextForSorting);
              signature.parameters.push(parameter);
            });
            return {
              v: signature
            };
          }();

          if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        } catch (e) {
          return null;
        }
      }, o.Data.Overloads)));
      res.activeParameter = o.Data.CurrentParameter;
      res.activeSignature = 1 + _fableCore.Seq.findIndex(function (s) {
        return s.parameters.length >= o.Data.CurrentParameter;
      }, _fableCore.Seq.sortWith(function (x, y) {
        return _fableCore.Util.compare(function (n) {
          return n.parameters.length;
        }(x), function (n) {
          return n.parameters.length;
        }(y));
      }, sigs));
      res.signatures = sigs;
    }

    return res;
  };

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.SignatureHelpProvider"], _ref.provideSignatureHelp = function provideSignatureHelp(doc, pos, ct) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg1) {
        return _Helpers.Promise.bind(function (_arg2) {
          return _Helpers.Promise.lift(mapResult(_arg2));
        }, (0, _LanguageService.methods)(doc.fileName, (pos.line + 0x80000000 >>> 0) - 0x80000000 + 1, (pos.character + 0x80000000 >>> 0) - 0x80000000 + 1));
      }, (0, _LanguageService.parse)(doc.fileName, doc.getText(), doc.version));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref;
}

function activate(selector, disposables) {
  _vscode.languages.registerSignatureHelpProvider(selector, createProvider(), "(", ",");
}