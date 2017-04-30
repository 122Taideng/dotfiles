"use strict";

exports.__esModule = true;
exports.Promise = exports.Markdown = exports.Array = exports.Patterns = exports.JS = exports.Utils = exports.Configuration = exports.Document = exports.Option = exports.String = exports.CodeRange = undefined;

var _vscode = require("vscode");

var _fableCore = require("fable-core");

var _Helpers = require("./../fable_external/Helpers-729269674");

var CodeRange = exports.CodeRange = function ($exports) {
  var fromDTO = $exports.fromDTO = function fromDTO(range) {
    return new _vscode.Range(range.StartLine - 1, range.StartColumn - 1, range.EndLine - 1, range.EndColumn - 1);
  };

  var fromDeclaration = $exports.fromDeclaration = function fromDeclaration(decl, length) {
    return new _vscode.Range(decl.Line - 1, decl.Column - 1, decl.Line - 1, decl.Column + length - 1);
  };

  var fromSymbolUse = $exports.fromSymbolUse = function fromSymbolUse(su) {
    return new _vscode.Range(su.StartLine - 1, su.StartColumn - 1, su.EndLine - 1, su.EndColumn - 1);
  };

  var fromError = $exports.fromError = function fromError(error) {
    return new _vscode.Range(error.StartLine - 1, error.StartColumn - 1, error.EndLine - 1, error.EndColumn - 1);
  };

  return $exports;
}({});

var _String = function ($exports) {
  var trim = $exports.trim = function trim(s) {
    return _fableCore.String.trim(s, "both");
  };

  var replace = $exports.replace = function replace(oldVal, newVal, str) {
    return str == null ? null : _fableCore.String.replace(str, oldVal, newVal);
  };

  var split = $exports.split = function split(seperator, s) {
    return _fableCore.String.split.apply(_fableCore.String, [s].concat(seperator));
  };

  var endWith = $exports.endWith = function endWith(ending, s) {
    return _fableCore.String.endsWith(s, ending);
  };

  var startWith = $exports.startWith = function startWith(ending, s) {
    return s.indexOf(ending) === 0;
  };

  return $exports;
}({});

exports.String = _String;

var Option = exports.Option = function ($exports) {
  var fill = $exports.fill = function fill(def, x) {
    return x == null ? def : x;
  };

  return $exports;
}({});

var _Document = function ($exports) {
  var $FSharp$CSharp$VB$Other$ = $exports.$FSharp$CSharp$VB$Other$ = function $FSharp$CSharp$VB$Other$(document) {
    return document.languageId === "fsharp" ? new _fableCore.Choice("Choice1Of4", [null]) : document.languageId === "csharp" ? new _fableCore.Choice("Choice2Of4", [null]) : document.languageId === "vb" ? new _fableCore.Choice("Choice3Of4", [null]) : new _fableCore.Choice("Choice4Of4", [null]);
  };

  return $exports;
}({});

exports.Document = _Document;

var Configuration = exports.Configuration = function ($exports) {
  var get = $exports.get = function get(defaultValue, key) {
    return _vscode.workspace.getConfiguration().get(key, defaultValue);
  };

  return $exports;
}({});

var Utils = exports.Utils = function ($exports) {
  var isNotNull = $exports.isNotNull = function isNotNull(o) {
    return o != null;
  };

  return $exports;
}({});

var JS = exports.JS = function ($exports) {
  return $exports;
}({});

var Patterns = exports.Patterns = function ($exports) {
  var $StartsWith$_$ = $exports.$StartsWith$_$ = function $StartsWith$_$(pat, str) {
    return str == null ? null : str.indexOf(pat) === 0 ? str : null;
  };

  var $Contains$_$ = $exports.$Contains$_$ = function $Contains$_$(pat, str) {
    return str == null ? null : str.indexOf(pat) >= 0 ? str : null;
  };

  return $exports;
}({});

var _Array = function ($exports) {
  var splitAt = $exports.splitAt = function splitAt(n, xs) {
    var $target0 = function $target0() {
      return [xs, []];
    };

    if (xs.length === 0) {
      return $target0();
    } else {
      if (xs.length === 1) {
        return $target0();
      } else {
        if (n >= xs.length ? true : n < 0) {
          return [xs, []];
        } else {
          return [xs.slice(0, n - 1 + 1), xs.slice(n, xs.length)];
        }
      }
    }
  };

  return $exports;
}({});

exports.Array = _Array;

var Markdown = exports.Markdown = function ($exports) {
  var replacePatterns = function () {
    var r = function r(pat) {
      return _fableCore.RegExp.create(pat, 8 | 1);
    };

    return _fableCore.List.ofArray([[r("<c>(((?!<c>)(?!<\\/c>).)*)<\\/c>"), _fableCore.String.fsFormat("`%s`")(function (x) {
      return x;
    })]]);
  }();

  var removePatterns = _fableCore.List.ofArray(["<summary>", "</summary>", "<para>", "</para>"]);

  var replaceXml = $exports.replaceXml = function replaceXml(str) {
    var res = function () {
      var folder = function folder(res) {
        return function (tupledArg) {
          var loop = function loop(res_1) {
            var matchValue = _fableCore.RegExp.match(tupledArg[0], res_1);

            if (matchValue != null) {
              return loop(_fableCore.String.replace(res_1, matchValue[0], tupledArg[1](matchValue[1])));
            } else {
              return res_1;
            }
          };

          return loop(res);
        };
      };

      return function (list) {
        return _fableCore.Seq.fold(function ($var1, $var2) {
          return folder($var1)($var2);
        }, str, list);
      };
    }()(replacePatterns);

    return function () {
      var folder = function folder(res_1) {
        return function (pat) {
          return _fableCore.String.replace(res_1, pat, "");
        };
      };

      return function (list) {
        return _fableCore.Seq.fold(function ($var3, $var4) {
          return folder($var3)($var4);
        }, res, list);
      };
    }()(removePatterns);
  };

  return $exports;
}({});

var _Promise = function ($exports) {
  var suppress = $exports.suppress = function suppress(pr) {
    return _Helpers.Promise.catch(function (_arg1) {
      return function (builder_) {
        return Promise.resolve();
      }(_Helpers.PromiseBuilderImp.promise);
    }, pr);
  };

  var executeForAll = $exports.executeForAll = function executeForAll(f, items) {
    return items.tail != null ? items.tail.tail == null ? function () {
      var x = items.head;
      return f(x);
    }() : function () {
      var tail = items.tail;
      var x = items.head;
      return _fableCore.Seq.fold(function (acc, next) {
        return _Helpers.Promise.bind(function (_arg1) {
          return f(next);
        }, acc);
      }, f(x), tail);
    }() : _Helpers.Promise.lift();
  };

  return $exports;
}({});

exports.Promise = _Promise;