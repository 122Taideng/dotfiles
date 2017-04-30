"use strict";

exports.__esModule = true;
exports.IonideDebugger = undefined;
exports.start = start;

var _vscodeDebugadapter = require("vscode-debugadapter");

var _Helpers = require("./DebugerComponents/Helpers");

var _Mdbg = require("./DebugerComponents/Mdbg");

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _fableCore = require("fable-core");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IonideDebugger = exports.IonideDebugger = function (_DebugSession) {
  _inherits(IonideDebugger, _DebugSession);

  function IonideDebugger() {
    _classCallCheck(this, IonideDebugger);

    var _this = _possibleConstructorReturn(this, _DebugSession.call(this));

    var x = {
      contents: null
    };
    var x_1 = _this;
    _this.contents = _this;

    _this.contents.setDebuggerColumnsStartAt1(true);

    _this.contents.setDebuggerLinesStartAt1(true);

    _this.brks = new Map();
    _this["init@25"] = 1;
    return _this;
  }

  IonideDebugger.prototype.initializeRequest = function initializeRequest(response, args) {
    var _this2 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} Init called");

      (0, _Mdbg.spawn)(__dirname);
      response.body.supportsEvaluateForHovers = true;
      return _Helpers.Promise.bind(function () {
        _this2.sendResponse(response);

        return Promise.resolve();
      }, (0, _Mdbg.config)());
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.launchRequest = function launchRequest(response, args) {
    var _this3 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} Launch called");

      return _Helpers.Promise.bind(function () {
        _this3.sendEvent(new _vscodeDebugadapter.InitializedEvent());

        if (args.stopOnEntry != null ? args.stopOnEntry : false) {
          _this3.sendResponse(response);

          _this3.sendEvent(new _vscodeDebugadapter.StoppedEvent("breakpoint", 0));

          return Promise.resolve();
        } else {
          var args_1 = {};
          args_1.threadId = 0;

          _this3.continueRequest(response, args_1);

          return Promise.resolve();
        }
      }, (0, _Mdbg.start)(args.program));
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.attachRequest = function attachRequest(response, args) {
    var _this4 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} Attach called");

      _this4.sendEvent(new _vscodeDebugadapter.InitializedEvent());

      return _Helpers.Promise.bind(function (_arg3) {
        return _Helpers.Promise.bind(function () {
          {
            setTimeout(function (_arg1) {
              var args_1 = {};
              args_1.threadId = 1;

              _this4.continueRequest(response, args_1);
            }, 1000);
          }
          return Promise.resolve();
        }, (0, _Mdbg.attach)(_arg3));
      }, (0, _Mdbg.getPid)(args.program));
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.disconnectRequest = function disconnectRequest(response, args) {
    _Helpers.Helpers.log("{LOG} Disconnect called");

    (0, _Mdbg.close)();
    this.sendResponse(response);
  };

  IonideDebugger.prototype.threadsRequest = function threadsRequest(response) {
    var _this5 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} Threads called");

      return _Helpers.Promise.bind(function (_arg5) {
        var body = {
          threads: _arg5.map(function (t) {
            return new _vscodeDebugadapter.Thread(t.id, t.name);
          })
        };
        response.body = body;

        _this5.sendResponse(response);

        return Promise.resolve();
      }, (0, _Mdbg.getThreads)());
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.stackTraceRequest = function stackTraceRequest(response, args) {
    var _this6 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} StackTrace called");

      return _Helpers.Promise.bind(function (_arg6) {
        var body = {
          stackFrames: _arg6.map(function (t) {
            var source = function () {
              var $var4 = t.source;

              if ($var4 != null) {
                return function (src) {
                  var name = path.basename(src);
                  return new _vscodeDebugadapter.Source(name, src);
                }($var4);
              } else {
                return $var4;
              }
            }();

            return new _vscodeDebugadapter.StackFrame(t.id, t.name, source, t.line);
          }),
          totalFrames: _arg6.length
        };
        response.body = body;

        _this6.sendResponse(response);

        return Promise.resolve();
      }, (0, _Mdbg.getStack)(args.levels, args.threadId));
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.scopesRequest = function scopesRequest(response, args) {
    var _this7 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} Scopes called");

      var body = {
        scopes: [new _vscodeDebugadapter.Scope("Local", 1, false)]
      };
      response.body = body;

      _this7.sendResponse(response);

      return Promise.resolve();
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.variablesRequest = function variablesRequest(response, args) {
    var _this8 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} Variables called");

      return _Helpers.Promise.bind(function (_arg7) {
        var body = {
          variables: _arg7.map(function (t) {
            return new _vscodeDebugadapter.Variable(t.name, t.value, 0);
          })
        };
        response.body = body;

        _this8.sendResponse(response);

        return Promise.resolve();
      }, (0, _Mdbg.getVariables)());
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.continueRequest = function continueRequest(response, args) {
    var _this9 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} Continue called");

      return _Helpers.Promise.bind(function (_arg8) {
        _this9.sendResponse(response);

        if (_arg8.Case === "Breakpoint") {
          _this9.sendEvent(new _vscodeDebugadapter.StoppedEvent("breakpoint", _arg8.Fields[0]));

          return Promise.resolve();
        } else {
          if (_arg8.Case === "Exception") {
            _this9.sendEvent(new _vscodeDebugadapter.StoppedEvent("exception", _arg8.Fields[0]));

            return Promise.resolve();
          } else {
            _this9.sendEvent(new _vscodeDebugadapter.TerminatedEvent());

            return Promise.resolve();
          }
        }
      }, (0, _Mdbg.go)());
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.nextRequest = function nextRequest(response, args) {
    var _this10 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} Next called");

      return _Helpers.Promise.bind(function (_arg9) {
        _this10.sendResponse(response);

        _this10.sendEvent(new _vscodeDebugadapter.StoppedEvent("step", _arg9));

        return Promise.resolve();
      }, (0, _Mdbg.next)());
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.stepInRequest = function stepInRequest(response) {
    var _this11 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} In called");

      return _Helpers.Promise.bind(function (_arg10) {
        _this11.sendResponse(response);

        _this11.sendEvent(new _vscodeDebugadapter.StoppedEvent("step", _arg10));

        return Promise.resolve();
      }, (0, _Mdbg.stepIn)());
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.stepOutRequest = function stepOutRequest(response) {
    var _this12 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} Out called");

      return _Helpers.Promise.bind(function (_arg11) {
        _this12.sendResponse(response);

        _this12.sendEvent(new _vscodeDebugadapter.StoppedEvent("step", _arg11));

        return Promise.resolve();
      }, (0, _Mdbg.stepOut)());
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.evaluateRequest = function evaluateRequest(response, args) {
    var _this13 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} Evaluate called");

      return _Helpers.Promise.bind(function (_arg12) {
        var body = {
          result: _arg12,
          variablesReference: 0
        };
        response.body = body;

        _this13.sendResponse(response);

        return Promise.resolve();
      }, (0, _Mdbg.getVariable)(args.expression));
    })(_Helpers.PromiseBuilderImp.promise);
  };

  IonideDebugger.prototype.setBreakPointsRequest = function setBreakPointsRequest(response, args) {
    var _this14 = this;

    (function (builder_) {
      _Helpers.Helpers.log("{LOG} Breakpoints called");

      var fileName = args.source.path;
      var file = path.basename(fileName);
      var current = _this14.brks.has(fileName) ? _this14.brks.get(fileName) : [];
      var source = new _vscodeDebugadapter.Source(file, fileName);

      var patternInput = _fableCore.List.partition(function (bp) {
        return _fableCore.Seq.exists(function (b) {
          return b.line === bp.line;
        }, args.breakpoints);
      }, _fableCore.Seq.toList(current));

      return _Helpers.Promise.bind(function (_arg13) {
        var toAdd = _fableCore.Seq.where(function (bp) {
          return !_fableCore.Seq.exists(function (b) {
            return b.line === bp.line;
          }, current);
        }, args.breakpoints);

        return _Helpers.Promise.bind(function (_arg14) {
          var res = Array.from(_fableCore.Seq.map(function (bp) {
            var verified = bp.status.Case === "Unbound" ? false : true;
            return [bp, new _vscodeDebugadapter.Breakpoint(verified, bp.line, 0, source)];
          }, _arg14));
          var newBrks = Array.from(_fableCore.Seq.delay(function () {
            return _fableCore.Seq.append(patternInput[0], _fableCore.Seq.delay(function () {
              return _fableCore.Seq.map(function (tuple) {
                return tuple[0];
              }, res);
            }));
          }));

          _this14.brks.set(fileName, newBrks);

          var resp = Array.from(_fableCore.Seq.delay(function () {
            return _fableCore.Seq.append(_fableCore.List.map(function (n) {
              return new _vscodeDebugadapter.Breakpoint(true, n.line, 0, source);
            }, patternInput[0]), _fableCore.Seq.delay(function () {
              return res.map(function (tuple) {
                return tuple[1];
              });
            }));
          }));
          var body = {
            breakpoints: resp
          };
          response.body = body;

          _this14.sendResponse(response);

          return Promise.resolve();
        }, _Helpers.Promise.all(_fableCore.Seq.map(function (bp) {
          return (0, _Mdbg.setBreakpoint)(file, bp.line);
        }, toAdd)));
      }, _Helpers.Promise.all(_fableCore.Seq.map(function (bp) {
        return (0, _Mdbg.deleteBreakpoint)(bp.id);
      }, patternInput[1])));
    })(_Helpers.PromiseBuilderImp.promise);
  };

  return IonideDebugger;
}(_vscodeDebugadapter.DebugSession);

_fableCore.Util.setInterfaces(IonideDebugger.prototype, [], "Ionide.VSCode.DebuggerModule.IonideDebugger");

function start() {
  {
    (function (arg00) {
      _vscodeDebugadapter.DebugSession.run(arg00);
    })(function () {
      return new IonideDebugger();
    });
  }
}

start();