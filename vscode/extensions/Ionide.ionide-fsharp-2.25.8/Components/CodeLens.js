"use strict";

exports.__esModule = true;
exports.changes = exports.refresh = exports.cache = undefined;
exports.activate = activate;

var _fableCore = require("fable-core");

var _vscode = require("vscode");

var _Utils = require("./../Core/Utils");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _LanguageService = require("./../Core/LanguageService");

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

var cache = exports.cache = _fableCore.Map.create(null, new _fableCore.GenericComparer(function (x, y) {
  return x < y ? -1 : x > y ? 1 : 0;
}));

var refresh = exports.refresh = new _vscode.EventEmitter();
var version = 0;
var flag = true;
var changes = exports.changes = new _fableCore.List();

function heightChange(change) {
  var oldHeight = (change.range.end.line - change.range.start.line + 0x80000000 >>> 0) - 0x80000000;

  var newHeight = _fableCore.Seq.sumBy(function (n) {
    return n === "\n" ? 1 : 0;
  }, change.text.split(""));

  return newHeight - oldHeight;
}

function createProvider() {
  var _onDidChangeCodeLense, _ref, _mutatorMap;

  var symbolsToCodeLens = function symbolsToCodeLens(doc) {
    return function (symbols) {
      return Array.from(_fableCore.Seq.collect(function (syms) {
        var range = _Utils.CodeRange.fromDTO(syms.Declaration.BodyRange);

        var codeLens = new _vscode.CodeLens(range);
        var codeLenses = Array.from(_fableCore.Seq.choose(function (sym) {
          return (((((((((sym.GlyphChar !== "Fc" ? sym.GlyphChar !== "M" : false) ? sym.GlyphChar !== "F" : false) ? sym.GlyphChar !== "P" : false) ? true : sym.IsAbstract) ? true : sym.EnclosingEntity === "I") ? true : sym.EnclosingEntity === "R") ? true : sym.EnclosingEntity === "D") ? true : sym.EnclosingEntity === "En") ? true : sym.EnclosingEntity === "E") ? null : new _vscode.CodeLens(_Utils.CodeRange.fromDTO(sym.BodyRange));
        }, syms.Nested));

        if (syms.Declaration.GlyphChar !== "Fc") {
          return codeLenses;
        } else {
          return [codeLens].concat(codeLenses);
        }
      }, symbols));
    };
  };

  var formatSignature = function formatSignature(sign) {
    var sign_1 = function () {
      var $target0 = function $target0() {
        return sign;
      };

      {
        var activePatternResult2622 = _Utils.Patterns.$StartsWith$_$("val", sign);

        if (activePatternResult2622 != null) {
          return $target0();
        } else {
          var activePatternResult2623 = _Utils.Patterns.$StartsWith$_$("member", sign);

          if (activePatternResult2623 != null) {
            return $target0();
          } else {
            var activePatternResult2624 = _Utils.Patterns.$StartsWith$_$("abstract", sign);

            if (activePatternResult2624 != null) {
              return $target0();
            } else {
              var activePatternResult2625 = _Utils.Patterns.$StartsWith$_$("static", sign);

              if (activePatternResult2625 != null) {
                return $target0();
              } else {
                var activePatternResult2626 = _Utils.Patterns.$StartsWith$_$("override", sign);

                if (activePatternResult2626 != null) {
                  return $target0();
                } else {
                  var matchValue = sign.indexOf("(");

                  if (matchValue > 0) {
                    return sign.substr(0, matchValue) + ":" + sign.substr(matchValue + 1);
                  } else {
                    return sign;
                  }
                }
              }
            }
          }
        }
      }
    }();

    var sign_2 = sign_1.indexOf(":") >= 0 ? _fableCore.String.join(":", sign_1.split(":").slice(1, sign_1.split(":").length)) : sign_1;

    var parms = _fableCore.String.split(sign_2, ["->"], null, 1);

    return _fableCore.String.join(" -> ", function (source) {
      return _fableCore.Seq.map(function (s) {
        return _Utils.String.trim(s);
      }, source);
    }(_fableCore.Seq.map(function (_arg1) {
      var activePatternResult2633 = _Utils.Patterns.$Contains$_$("(requires", _arg1);

      if (activePatternResult2633 != null) {
        var p = activePatternResult2633;
        return p;
      } else {
        var activePatternResult2631 = _Utils.Patterns.$Contains$_$("*", _arg1);

        if (activePatternResult2631 != null) {
          var _p = activePatternResult2631;
          return _fableCore.String.join("* ", _fableCore.Seq.map(function (z) {
            return z.indexOf(":") >= 0 ? z.split(":")[1] : z;
          }, _p.split("*")));
        } else {
          var activePatternResult2629 = _Utils.Patterns.$Contains$_$(":", _arg1);

          if (activePatternResult2629 != null) {
            var _p2 = activePatternResult2629;
            return _p2.split(":")[1];
          } else {
            return _arg1;
          }
        }
      }
    }, parms)));
  };

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.CodeLensProvider"], _ref.provideCodeLenses = function provideCodeLenses(doc, _arg2) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg5) {
        var d = (_arg5.length > 0 ? flag : false) ? function () {
          exports.cache = cache = function () {
            var key = doc.fileName;
            return function (table) {
              return _fableCore.Map.add(key, _arg5, table);
            };
          }()(cache);

          exports.changes = changes = new _fableCore.List();
          return _arg5;
        }() : function () {
          var chngs = _fableCore.List.choose(function (n) {
            var r = heightChange(n);

            if (r === 0) {
              return null;
            } else {
              return [n.range.start.line, r];
            }
          }, changes);

          var fromCache = _fableCore.Map.tryFind(doc.fileName, cache) != null ? _fableCore.Map.tryFind(doc.fileName, cache) : [];
          var res = fromCache.map(function (n) {
            var hChange = _fableCore.Seq.sumBy(function (tupledArg) {
              return tupledArg[0] <= n.range.start.line ? tupledArg[1] : 0;
            }, chngs);

            var ln = n.range.start.line + hChange;
            var range = new _vscode.Range(ln, n.range.start.character, ln, n.range.end.character);
            n.range = range;
            return n;
          });

          exports.cache = cache = function () {
            var key = doc.fileName;
            return function (table) {
              return _fableCore.Map.add(key, res, table);
            };
          }()(cache);

          exports.changes = changes = new _fableCore.List();
          return res;
        }();
        flag = false;
        return _Helpers.Promise.lift(Array.from(d));
      }, flag ? function (builder__1) {
        return _Helpers.Promise.bind(function (_arg4) {
          return _Helpers.Promise.lift(_Utils.Utils.isNotNull(_arg4) ? function () {
            var res = symbolsToCodeLens(doc)(_arg4.Data);
            return res;
          }() : []);
        }, (0, _LanguageService.declarations)(doc.fileName, version));
      }(_Helpers.PromiseBuilderImp.promise) : _Helpers.Promise.lift([]));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref.resolveCodeLens = function resolveCodeLens(codeLens, _arg3) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg6) {
        var cmd = {};

        if (_Utils.Utils.isNotNull(_arg6)) {
          cmd.title = formatSignature(_arg6.Data);
        } else {
          cmd.title = "";
        }

        codeLens.command = cmd;
        return _Helpers.Promise.lift(codeLens);
      }, (0, _LanguageService.signature)(_vscode.window.activeTextEditor.document.fileName, (codeLens.range.start.line + 0x80000000 >>> 0) - 0x80000000 + 1, (codeLens.range.start.character + 0x80000000 >>> 0) - 0x80000000 + 1));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _onDidChangeCodeLense = "onDidChangeCodeLenses", _mutatorMap = {}, _mutatorMap[_onDidChangeCodeLense] = _mutatorMap[_onDidChangeCodeLense] || {}, _mutatorMap[_onDidChangeCodeLense].get = function () {
    return refresh.event;
  }, _defineEnumerableProperties(_ref, _mutatorMap), _ref;
}

function textChangedHandler(event) {
  if (_Utils.Utils.isNotNull(_vscode.window.activeTextEditor) ? event.document.fileName === _vscode.window.activeTextEditor.document.fileName : false) {
    exports.changes = changes = _fableCore.Seq.toList(_fableCore.Seq.delay(function () {
      return _fableCore.Seq.append(changes, _fableCore.Seq.delay(function () {
        return event.contentChanges;
      }));
    }));
    refresh.fire(-1);
  }
}

function fileOpenedHandler(event) {
  if (_Utils.Utils.isNotNull(event)) {
    exports.changes = changes = new _fableCore.List();
    version = event.document.version;
    flag = true;
  }
}

function activate(selector, disposables) {
  refresh.event(function (n) {
    version = n;
    flag = n > 0;
    return null;
  });

  _vscode.workspace.onDidChangeTextDocument(function (event) {
    textChangedHandler(event);
  }, null, disposables);

  _vscode.window.onDidChangeActiveTextEditor(function (event) {
    fileOpenedHandler(event);
  }, null, disposables);

  _vscode.languages.registerCodeLensProvider(selector, createProvider());

  refresh.fire(1);
}