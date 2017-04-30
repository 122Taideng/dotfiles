"use strict";

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.activate = activate;

var _fableCore = require("fable-core");

var _Utils = require("./../Core/Utils");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _LanguageService = require("./../Core/LanguageService");

var _vscode = require("vscode");

function createProvider() {
  var _ref;

  var createCommentBlock = function createCommentBlock(comment) {
    return Array.from(_fableCore.Seq.singleton(_Utils.String.trim(_fableCore.String.join("\n\n", Array.from(_fableCore.Seq.mapIndexed(function (i, line) {
      var v = (i === 0 ? !_fableCore.String.isNullOrWhiteSpace(line) : false) ? "\n" + _fableCore.String.trim(line, "both") : _fableCore.String.trim(line, "both");
      return _Utils.Markdown.replaceXml(v);
    }, comment.split("\n").filter(function ($var11) {
      return !_fableCore.String.isNullOrWhiteSpace($var11);
    })))))));
  };

  var mapResult = function mapResult(doc) {
    return function (pos) {
      return function (o) {
        var range = doc.getWordRangeAtPosition(pos);

        if (_Utils.Utils.isNotNull(o)) {
          var _ret = function () {
            var res = Array.from(_fableCore.Seq.collect(function (x) {
              return x;
            }, o.Data))[0];

            if (res.Signature != undefined) {
              var _ret2 = function () {
                var markStr = function markStr(lang) {
                  return function (value) {
                    return {
                      language: lang,
                      value: _fableCore.String.trim(value, "both")
                    };
                  };
                };

                var fsharpBlock = function fsharpBlock(lines) {
                  return markStr("fsharp")(_fableCore.String.join("\n", lines));
                };

                var sigContent = function () {
                  var lines = _Utils.String.split(["\n"], res.Signature).filter(function ($var12) {
                    return !_fableCore.String.isNullOrWhiteSpace($var12);
                  });

                  var matchValue = _Utils.Array.splitAt(lines.length - 1, lines);

                  var $target1 = function $target1() {
                    return [fsharpBlock(lines)];
                  };

                  if (matchValue[1].length === 1) {
                    var activePatternResult2176 = _Utils.Patterns.$StartsWith$_$("Full name:", matchValue[1][0]);

                    if (activePatternResult2176 != null) {
                      var _ret3 = function () {
                        var fullName = activePatternResult2176;
                        var h = matchValue[0];
                        return {
                          v: Array.from(_fableCore.Seq.delay(function () {
                            return _fableCore.Seq.append(_fableCore.Seq.singleton(fsharpBlock(h)), _fableCore.Seq.delay(function () {
                              return _fableCore.Seq.singleton("_" + fullName + "_");
                            }));
                          }))
                        };
                      }();

                      if ((typeof _ret3 === "undefined" ? "undefined" : _typeof(_ret3)) === "object") return _ret3.v;
                    } else {
                      return $target1();
                    }
                  } else {
                    return $target1();
                  }
                }();

                var commentContent = createCommentBlock(_Utils.String.replace("&gt;", ">", _Utils.String.replace("&lt;", "<", res.Comment)));
                var result = {};
                result.range = range;
                result.contents = Array.from(sigContent.concat(commentContent));
                return {
                  v: {
                    v: result
                  }
                };
              }();

              if ((typeof _ret2 === "undefined" ? "undefined" : _typeof(_ret2)) === "object") return _ret2.v;
            } else {
              return {
                v: {}
              };
            }
          }();

          if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        } else {
          return {};
        }
      };
    };
  };

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.HoverProvider"], _ref.provideHover = function provideHover(doc, pos, _arg1) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg2) {
        return _Helpers.Promise.lift(mapResult(doc)(pos)(_arg2));
      }, (0, _LanguageService.tooltip)(doc.fileName, (pos.line + 0x80000000 >>> 0) - 0x80000000 + 1, (pos.character + 0x80000000 >>> 0) - 0x80000000 + 1));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref;
}

function activate(selector, disposables) {
  _vscode.languages.registerHoverProvider(selector, createProvider());
}