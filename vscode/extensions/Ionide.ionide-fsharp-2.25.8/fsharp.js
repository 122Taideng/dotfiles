"use strict";

exports.__esModule = true;
exports.activate = activate;
exports.deactivate = deactivate;

var _Utils = require("./Core/Utils");

var _Helpers = require("./fable_external/Helpers-729269674");

var _Project = require("./Core/Project");

var _CodeLens = require("./Components/CodeLens");

var _Linter = require("./Components/Linter");

var _Errors = require("./Components/Errors");

var _Tooltip = require("./Components/Tooltip");

var _Autocomplete = require("./Components/Autocomplete");

var _ParameterHints = require("./Components/ParameterHints");

var _Definition = require("./Components/Definition");

var _References = require("./Components/References");

var _Symbols = require("./Components/Symbols");

var _Highlights = require("./Components/Highlights");

var _Rename = require("./Components/Rename");

var _WorkspaceSymbols = require("./Components/WorkspaceSymbols");

var _QuickInfo = require("./Components/QuickInfo");

var _QuickFix = require("./Components/QuickFix");

var _ResolveNamespaces = require("./Components/ResolveNamespaces");

var _UnionCaseGenerator = require("./Components/UnionCaseGenerator");

var _Help = require("./Components/Help");

var _Expecto = require("./Components/Expecto");

var _MSBuild = require("./Components/MSBuild");

var _LanguageService = require("./Core/LanguageService");

var _Forge = require("./Components/Forge");

var _LegacyFsi = require("./Components/LegacyFsi");

var _Fsi = require("./Components/Fsi");

var _WebPreview = require("./Components/WebPreview");

function activate(disposables) {
  var df = {};
  df.language = "fsharp";
  var df_ = df;

  var legacyFsi = _Utils.Configuration.get(false, "FSharp.legacyFSI");

  var resolve = _Utils.Configuration.get(false, "FSharp.resolveNamespaces");

  _Helpers.Promise.catch(function (error) {
    return function (builder_) {
      return Promise.resolve();
    }(_Helpers.PromiseBuilderImp.promise);
  }, _Helpers.Promise.onSuccess(function (_arg3) {
    _Helpers.Promise.bind(function () {
      return (0, _Project.activate)();
    }, _Helpers.Promise.onSuccess(function () {
      (0, _CodeLens.activate)(df_, disposables);
      (0, _Linter.activate)(df_, disposables);
    }, (0, _Errors.activate)(disposables)));

    (0, _Tooltip.activate)(df_, disposables);
    (0, _Autocomplete.activate)(df_, disposables);
    (0, _ParameterHints.activate)(df_, disposables);
    (0, _Definition.activate)(df_, disposables);
    (0, _References.activate)(df_, disposables);
    (0, _Symbols.activate)(df_, disposables);
    (0, _Highlights.activate)(df_, disposables);
    (0, _Rename.activate)(df_, disposables);
    (0, _WorkspaceSymbols.activate)(df_, disposables);
    (0, _QuickInfo.activate)(disposables);
    (0, _QuickFix.activate)(df_, disposables);

    if (resolve) {
      (0, _ResolveNamespaces.activate)(df_, disposables);
    }

    (0, _UnionCaseGenerator.activate)(df_, disposables);
    (0, _Help.activate)(disposables);
    (0, _Expecto.activate)(disposables);
    (0, _MSBuild.activate)(disposables);
  }, (0, _LanguageService.start)()));

  (0, _Forge.activate)(disposables);

  if (legacyFsi) {
    (0, _LegacyFsi.activate)(disposables);
  } else {
    (0, _Fsi.activate)(disposables);
  }

  (0, _WebPreview.activate)(disposables);
}

function deactivate(disposables) {
  (0, _LanguageService.stop)();
}