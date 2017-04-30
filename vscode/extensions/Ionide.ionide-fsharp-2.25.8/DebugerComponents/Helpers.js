"use strict";

exports.__esModule = true;
exports.Helpers = exports.Process = exports.PromiseBuilderImp = exports.Promise = undefined;

var _fableCore = require("fable-core");

var _child_process = require("child_process");

var child_process = _interopRequireWildcard(_child_process);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Promise = function ($exports) {
  var create = $exports.create = function create(body) {
    return new Promise(function (resolverFunc, rejectorFunc) {
      body(function (v) {
        resolverFunc(v);
      })(function (e) {
        rejectorFunc(e);
      });
    });
  };

  var map = $exports.map = function map(a, pr) {
    return pr.then(a);
  };

  var bind = $exports.bind = function bind(a, pr) {
    return pr.then(a);
  };

  var _catch = $exports.catch = function _catch(a, pr) {
    return pr.then(null, a);
  };

  var either = $exports.either = function either(a, b, pr) {
    return pr.then(a, b);
  };

  var lift = $exports.lift = function lift(a) {
    return Promise.resolve(a);
  };

  var reject = $exports.reject = function reject(reason) {
    return Promise.reject(reason);
  };

  var onSuccess = $exports.onSuccess = function onSuccess(a, pr) {
    return pr.then(function (value) {
      a(value);
      return value;
    });
  };

  var onFail = $exports.onFail = function onFail(a, pr) {
    return pr.catch(function (reason) {
      a(reason);
      return reject(reason);
    });
  };

  var all = $exports.all = function all(prs) {
    return Promise.all(prs);
  };

  var empty = $exports.empty = function empty() {
    return lift();
  };

  var PromiseBuilder = $exports.PromiseBuilder = function PromiseBuilder() {
    _classCallCheck(this, PromiseBuilder);
  };

  _fableCore.Util.setInterfaces(PromiseBuilder.prototype, [], "Helpers.Promise.PromiseBuilder");

  return $exports;
}({});

exports.Promise = _Promise;

var PromiseBuilderImp = exports.PromiseBuilderImp = function ($exports) {
  var promise = $exports.promise = new _Promise.PromiseBuilder();
  return $exports;
}({});

var Process = exports.Process = function ($exports) {
  var spawn = $exports.spawn = function spawn(path) {
    return child_process.spawn(path);
  };

  var onExit = $exports.onExit = function onExit(f, proc) {
    proc.on("exit", f);
    return proc;
  };

  var onOutput = $exports.onOutput = function onOutput(f, proc) {
    proc.stdout.on("data", f);
    return proc;
  };

  var onErrorOutput = $exports.onErrorOutput = function onErrorOutput(f, proc) {
    proc.stderr.on("data", f);
    return proc;
  };

  var onError = $exports.onError = function onError(f, proc) {
    proc.on("error", f);
    return proc;
  };

  return $exports;
}({});

var Helpers = exports.Helpers = function ($exports) {
  var log = $exports.log = function log(msg) {
    console.log(_fableCore.String.fsFormat("[MDBG] %s")(function (x) {
      return x;
    })(msg));
  };

  return $exports;
}({});