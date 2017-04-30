"use strict";

exports.__esModule = true;
exports.getHelp = getHelp;
exports.activate = activate;

var _vscode = require("vscode");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _fableCore = require("fable-core");

var _LanguageService = require("./../Core/LanguageService");

function getHelp() {
  var te = _vscode.window.activeTextEditor;
  var doc = te.document;
  var pos = te.selection.start;

  (function (builder_) {
    return _Helpers.Promise.bind(function (_arg1) {
      var uri = _vscode.Uri.parse("https://msdn.microsoft.com/query/dev14.query");

      var query = _fableCore.String.fsFormat("appId=Dev14IDEF1&l=EN-US&k=k(%s);k(DevLang-fsharp);k(TargetFrameworkMoniker-.NETFramework,Version%%3Dv4.5)&rd=true")(function (x) {
        return x;
      })(encodeURIComponent(_arg1.Data));

      var change = {
        query: query
      };
      var uri_ = uri.with(change);
      return _vscode.commands.executeCommand("vscode.open", uri_, 3);
    }, (0, _LanguageService.f1Help)(doc.fileName, (pos.line + 0x80000000 >>> 0) - 0x80000000 + 1, (pos.character + 0x80000000 >>> 0) - 0x80000000 + 1));
  })(_Helpers.PromiseBuilderImp.promise);
}

function activate(disposables) {
  var registerCommand = function registerCommand(com) {
    return function (f) {
      _vscode.commands.registerCommand(com, f);
    };
  };

  registerCommand("FSharp.getHelp")(function () {
    getHelp();
  });
}