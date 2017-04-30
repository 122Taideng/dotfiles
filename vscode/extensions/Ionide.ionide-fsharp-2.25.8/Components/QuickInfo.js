"use strict";

exports.__esModule = true;
exports.activate = activate;

var _Utils = require("./../Core/Utils");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _fableCore = require("fable-core");

var _vscode = require("vscode");

var _LanguageService = require("./../Core/LanguageService");

var item = null;

function handle_(event) {
  return function (builder_) {
    return event.textEditor.document != undefined ? function () {
      var doc = event.textEditor.document;

      var activePatternResult2431 = _Utils.Document.$FSharp$CSharp$VB$Other$(doc);

      if (activePatternResult2431.Case === "Choice1Of4") {
        var pos = event.selections[0].active;
        return _Helpers.Promise.bind(function (_arg1) {
          return _Utils.Utils.isNotNull(_arg1) ? function () {
            var res = Array.from(_fableCore.Seq.collect(function (x) {
              return x;
            }, _arg1.Data))[0].Signature;

            if (res != undefined) {
              var t = res.split("\n")[0];

              _fableCore.Seq.iterate(function (n) {
                n.hide();
              }, function () {
                var $var29 = item;

                if ($var29 != null) {
                  return [$var29];
                } else {
                  return [];
                }
              }());

              var i = _vscode.window.createStatusBarItem(1, -1);

              i.text = t;
              i.tooltip = res;
              i.show();
              item = i;
              return Promise.resolve();
            } else {
              return Promise.resolve();
            }
          }() : Promise.resolve();
        }, (0, _LanguageService.tooltip)(doc.fileName, (pos.line + 0x80000000 >>> 0) - 0x80000000 + 1, (pos.character + 0x80000000 >>> 0) - 0x80000000 + 1));
      } else {
        return Promise.resolve();
      }
    }() : Promise.resolve();
  }(_Helpers.PromiseBuilderImp.promise);
}

var timer = null;

function handle(event) {
  _fableCore.Seq.iterate(function (timer_1) {
    clearTimeout(timer_1);
  }, function () {
    var $var30 = timer;

    if ($var30 != null) {
      return [$var30];
    } else {
      return [];
    }
  }());

  timer = setTimeout(function (n) {
    return handle_(event);
  }, 500);
}

function activate(disposables) {
  _vscode.window.onDidChangeTextEditorSelection(function (event) {
    handle(event);
  }, null, disposables);
}