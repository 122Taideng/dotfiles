"use strict";

exports.__esModule = true;
exports.activate = activate;

var _vscode = require("vscode");

var _Utils = require("./../Core/Utils");

var _fableCore = require("fable-core");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _LanguageService = require("./../Core/LanguageService");

function createProvider() {
  var _ref;

  var provider = {};

  var convertToKind = function convertToKind(code) {
    var $var13 = null;

    switch (code) {
      case "C":
        $var13 = 6;
        break;

      case "E":
        $var13 = 12;
        break;

      case "S":
        $var13 = 11;
        break;

      case "I":
        $var13 = 7;
        break;

      case "N":
        $var13 = 8;
        break;

      case "M":
        $var13 = 1;
        break;

      case "P":
        $var13 = 9;
        break;

      case "F":
        $var13 = 4;
        break;

      case "T":
        $var13 = 6;
        break;

      case "K":
        $var13 = 13;
        break;

      default:
        $var13 = 0;
    }

    return $var13;
  };

  var mapCompletion = function mapCompletion(doc) {
    return function (pos) {
      return function (o) {
        var lineStr = doc.getText(new _vscode.Range(pos.line, 0, pos.line, 1000));
        var chars = lineStr.split("");
        var noSpaces = chars.filter(function () {
          var x = " ";
          return function (y) {
            return x !== y;
          };
        }());
        var spacesCount = chars.slice(0, (pos.character + 0x80000000 >>> 0) - 0x80000000).filter(function () {
          var x = " ";
          return function (y) {
            return x === y;
          };
        }()).length;
        var index = (pos.character + 0x80000000 >>> 0) - 0x80000000 - spacesCount - 1;
        var prevChar = noSpaces[index];

        if (_Utils.Utils.isNotNull(o)) {
          return Array.from(Array.from(_fableCore.Seq.choose(function (c) {
            return (prevChar === "." ? c.GlyphChar === "K" : false) ? null : function () {
              var range = doc.getWordRangeAtPosition(pos);
              var length = range != undefined ? range.end.character - range.start.character : 0;
              var result = {};
              result.kind = convertToKind(c.GlyphChar);
              result.label = c.Name;
              result.insertText = c.ReplacementText;
              return result;
            }();
          }, o.Data)));
        } else {
          return [];
        }
      };
    };
  };

  var mapHelptext = function mapHelptext(sug) {
    return function (o) {
      if (_Utils.Utils.isNotNull(o)) {
        var res = Array.from(_fableCore.Seq.collect(function (x) {
          return x;
        }, o.Data.Overloads))[0];
        sug.documentation = _Utils.Markdown.replaceXml(res.Comment);
        sug.detail = res.Signature;
      }

      return sug;
    };
  };

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.CompletionItemProvider"], _ref.provideCompletionItems = function provideCompletionItems(doc, pos, ct) {
    return function (builder_) {
      var setting = _Utils.Configuration.get(true, "FSharp.keywordsAutocomplete");

      var ln = doc.lineAt(pos.line);
      return _Helpers.Promise.bind(function (_arg1) {
        return _Helpers.Promise.lift(mapCompletion(doc)(pos)(_arg1));
      }, (0, _LanguageService.completion)(doc.fileName, ln.text, (pos.line + 0x80000000 >>> 0) - 0x80000000 + 1, (pos.character + 0x80000000 >>> 0) - 0x80000000 + 1, setting));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref.resolveCompletionItem = function resolveCompletionItem(sug, ct) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg2) {
        return _Helpers.Promise.lift(mapHelptext(sug)(_arg2));
      }, (0, _LanguageService.helptext)(sug.label));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref;
}

function activate(selector, disposables) {
  _vscode.languages.registerCompletionItemProvider(selector, createProvider(), ".");
}