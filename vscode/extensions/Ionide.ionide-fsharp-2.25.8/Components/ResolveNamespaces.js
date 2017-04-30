"use strict";

exports.__esModule = true;
exports.insertLine = insertLine;
exports.activate = activate;

var _fableCore = require("fable-core");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _Utils = require("./../Core/Utils");

var _LanguageService = require("./../Core/LanguageService");

var _vscode = require("vscode");

var _DTO = require("./../Core/DTO");

function createProvider() {
  var _ref;

  return _ref = {}, _ref[_fableCore.Symbol.interfaces] = ["Fable.Import.vscode.CodeActionProvider"], _ref.provideCodeActions = function provideCodeActions(doc, range, context, ct) {
    return function (builder_) {
      var diagnostic = _fableCore.Seq.tryFind(function (d) {
        return d.message.indexOf("is not defined") >= 0;
      }, context.diagnostics);

      return _Helpers.Promise.bind(function (_arg2) {
        return _Helpers.Promise.lift(Array.from(_arg2));
      }, diagnostic != null ? function (builder__1) {
        return _Helpers.Promise.bind(function (_arg1) {
          return _Utils.Utils.isNotNull(_arg1) ? function () {
            var word = _arg1.Data.Word;

            var quals = _arg1.Data.Qualifies.map(function (suggestion) {
              var cmd = {};
              cmd.title = _fableCore.String.fsFormat("Use %s")(function (x) {
                return x;
              })(suggestion.Qualifier);
              cmd.command = "fsharp.useNamespace";
              cmd.arguments = [doc, diagnostic.range, suggestion.Qualifier];
              return cmd;
            });

            var opens = _arg1.Data.Opens.map(function (suggestion) {
              var cmd = {};
              cmd.title = _fableCore.String.fsFormat("Open %s")(function (x) {
                return x;
              })(suggestion.Namespace);
              cmd.command = "fsharp.openNamespace";
              cmd.arguments = [doc, suggestion, suggestion.Namespace];
              return cmd;
            });

            return _Helpers.Promise.lift(Array.from(_fableCore.Seq.delay(function () {
              return _fableCore.Seq.append(quals, _fableCore.Seq.delay(function () {
                return opens;
              }));
            })));
          }() : _Helpers.Promise.lift([]);
        }, (0, _LanguageService.resolveNamespaces)(doc.fileName, (range.start.line + 0x80000000 >>> 0) - 0x80000000 + 1, (range.start.character + 0x80000000 >>> 0) - 0x80000000 + 2));
      }(_Helpers.PromiseBuilderImp.promise) : function (builder__1) {
        return _Helpers.Promise.lift([]);
      }(_Helpers.PromiseBuilderImp.promise));
    }(_Helpers.PromiseBuilderImp.promise);
  }, _ref;
}

function getLineStr(doc, line) {
  return _fableCore.String.trim(doc.getText(new _vscode.Range(line, 0, line, 1000)), "both");
}

function adjustInsertionPoint(doc, ctx) {
  var line = function () {
    var $var35 = null;

    switch (ctx.Type) {
      case "TopModule":
        if (ctx.Line > 1) {
          var _line = getLineStr(doc, ctx.Line - 2);

          var isImpliciteTopLevelModule = !(_line.indexOf("module") === 0 ? !_fableCore.String.endsWith(_line, "=") : false);

          if (isImpliciteTopLevelModule) {
            $var35 = 1;
          } else {
            $var35 = ctx.Line;
          }
        } else {
          $var35 = 1;
        }

        break;

      case "Namespace":
        if (ctx.Line > 1) {
          $var35 = function (_arg1) {
            return _arg1 == null ? ctx.Line : _arg1 + 2;
          }(_fableCore.Seq.tryPick(function (tupledArg) {
            return tupledArg[1].indexOf("namespace") === 0 ? tupledArg[0] : null;
          }, _fableCore.List.mapIndexed(function (i, line) {
            return [i, getLineStr(doc, line)];
          }, _fableCore.Seq.toList(_fableCore.Seq.range(0, ctx.Line - 1)))));
        } else {
          $var35 = 1;
        }

        break;

      default:
        $var35 = ctx.Line;
    }

    return $var35;
  }();

  return new _DTO.OpenNamespace(ctx.Namespace, ctx.Name, ctx.Type, line, ctx.Column, ctx.MultipleNames);
}

function insertLine(doc, line, lineStr) {
  var edit = new _vscode.WorkspaceEdit();

  var uri = _vscode.Uri.file(doc.fileName);

  var position = new _vscode.Position(line, 0);
  edit.insert(uri, position, lineStr);
  return _vscode.workspace.applyEdit(edit);
}

function applyQualify(doc, range, suggestion) {
  var edit = new _vscode.WorkspaceEdit();

  var uri = _vscode.Uri.file(doc.fileName);

  edit.replace(uri, range, suggestion);
  return _vscode.workspace.applyEdit(edit);
}

function applyOpen(doc, ctx, suggestion) {
  var ctx_1 = adjustInsertionPoint(doc, ctx);
  var docLine = ctx_1.Line - 1;
  var lineStr = _fableCore.String.replicate(ctx_1.Column, " ") + "open " + suggestion + "\n";
  return function (builder_) {
    return _Helpers.Promise.bind(function (_arg1) {
      return _Helpers.Promise.bind(function (_arg2) {
        return _Helpers.Promise.bind(function (_arg3) {
          return _Helpers.Promise.lift();
        }, (((ctx_1.Column === 0 ? true : ctx_1.Type === "Namespace") ? docLine > 0 : false) ? !(getLineStr(doc, docLine - 1).indexOf("open") === 0) : false) ? insertLine(doc, docLine, "") : _Helpers.Promise.lift(false));
      }, getLineStr(doc, docLine + 1) !== "" ? insertLine(doc, docLine + 1, "") : _Helpers.Promise.lift(false));
    }, insertLine(doc, docLine, lineStr));
  }(_Helpers.PromiseBuilderImp.promise);
}

function activate(selector, disposables) {
  _vscode.languages.registerCodeActionsProvider(selector, createProvider());

  _vscode.commands.registerCommand("fsharp.openNamespace", function (a, b, c) {
    return applyOpen(a, b, c);
  });

  _vscode.commands.registerCommand("fsharp.useNamespace", function (a, b, c) {
    return applyQualify(a, b, c);
  });
}