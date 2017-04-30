"use strict";

exports.__esModule = true;
exports.start$27 = exports.port = exports.fsacStdoutWriter = exports.log = exports.logLanguageServiceRequestsOutputWindowLevel = exports.logLanguageServiceRequestsConfigSetting = exports.LogConfigSetting = exports.devMode = exports.ax = undefined;
exports.createConfiguredLoggers = createConfiguredLoggers;
exports.genPort = genPort;
exports.project = project;
exports.parseProjects = parseProjects;
exports.parseProjectsInBackground = parseProjectsInBackground;
exports.parse = parse;
exports.helptext = helptext;
exports.completion = completion;
exports.symbolUse = symbolUse;
exports.symbolUseProject = symbolUseProject;
exports.methods = methods;
exports.tooltip = tooltip;
exports.toolbar = toolbar;
exports.signature = signature;
exports.findDeclaration = findDeclaration;
exports.f1Help = f1Help;
exports.declarations = declarations;
exports.declarationsProjects = declarationsProjects;
exports.compilerLocation = compilerLocation;
exports.lint = lint;
exports.resolveNamespaces = resolveNamespaces;
exports.unionCaseGenerator = unionCaseGenerator;
exports.registerNotify = registerNotify;
exports.startSocket = startSocket;
exports.start = start;
exports.stop = stop;

var _fableCore = require("fable-core");

var _Utils = require("./Utils");

var _Logging = require("./Logging");

var _vscode = require("vscode");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _DTO = require("./DTO");

var _ws = require("ws");

var _ws2 = _interopRequireDefault(_ws);

var _child_process = require("child_process");

var child_process = _interopRequireWildcard(_child_process);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ax = exports.ax = require("axios");

var devMode = exports.devMode = false;

var LogConfigSetting = exports.LogConfigSetting = function () {
  function LogConfigSetting(caseName, fields) {
    _classCallCheck(this, LogConfigSetting);

    this.Case = caseName;
    this.Fields = fields;
  }

  LogConfigSetting.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsUnions(this, other);
  };

  LogConfigSetting.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareUnions(this, other);
  };

  return LogConfigSetting;
}();

_fableCore.Util.setInterfaces(LogConfigSetting.prototype, ["FSharpUnion", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.LanguageService.LogConfigSetting");

var logLanguageServiceRequestsConfigSetting = exports.logLanguageServiceRequestsConfigSetting = function () {
  try {
    var matchValue = _Utils.Configuration.get("", "FSharp.logLanguageServiceRequests");

    var $var5 = null;

    switch (matchValue) {
      case "devconsole":
        $var5 = new LogConfigSetting("DevConsole", []);
        break;

      case "output":
        $var5 = new LogConfigSetting("Output", []);
        break;

      case "both":
        $var5 = new LogConfigSetting("Both", []);
        break;

      default:
        $var5 = new LogConfigSetting("None", []);
    }

    return $var5;
  } catch (matchValue) {
    return new LogConfigSetting("None", []);
  }
}();

var logLanguageServiceRequestsOutputWindowLevel = exports.logLanguageServiceRequestsOutputWindowLevel = function () {
  try {
    var matchValue = _Utils.Configuration.get("INFO", "FSharp.logLanguageServiceRequestsOutputWindowLevel");

    var $var6 = null;

    switch (matchValue) {
      case "DEBUG":
        $var6 = new _Logging.Level("DEBUG", []);
        break;

      case "INFO":
        $var6 = new _Logging.Level("INFO", []);
        break;

      case "WARN":
        $var6 = new _Logging.Level("WARN", []);
        break;

      case "ERROR":
        $var6 = new _Logging.Level("ERROR", []);
        break;

      default:
        $var6 = new _Logging.Level("INFO", []);
    }

    return $var6;
  } catch (matchValue) {
    return new _Logging.Level("INFO", []);
  }
}();

function createConfiguredLoggers(source, channelName) {
  var patternInput = logLanguageServiceRequestsConfigSetting.Case === "Both" ? [_vscode.window.createOutputChannel(channelName), true] : logLanguageServiceRequestsConfigSetting.Case === "DevConsole" ? [null, true] : logLanguageServiceRequestsConfigSetting.Case === "Output" ? [_vscode.window.createOutputChannel(channelName), false] : [null, false];
  var consoleMinLevel = patternInput[1] ? new _Logging.Level("DEBUG", []) : new _Logging.Level("WARN", []);

  var serverStdoutChannel = function () {
    var matchValue = [consoleMinLevel, patternInput[0]];

    var $target1 = function $target1() {
      return null;
    };

    if (matchValue[0].Case === "DEBUG") {
      if (matchValue[1] != null) {
        return _vscode.window.createOutputChannel(channelName + " (server)");
      } else {
        return $target1();
      }
    } else {
      return $target1();
    }
  }();

  var editorSideLogger = new _Logging.ConsoleAndOutputChannelLogger(source, logLanguageServiceRequestsOutputWindowLevel, patternInput[0], consoleMinLevel);

  if (!logLanguageServiceRequestsOutputWindowLevel.Equals(new _Logging.Level("DEBUG", []))) {
    var levelString = _fableCore.Util.toString(logLanguageServiceRequestsOutputWindowLevel);

    editorSideLogger.Info("Logging to output at level %s. If you want detailed messages, try level DEBUG.", levelString);
  }

  var fsacStdOutWriter = function fsacStdOutWriter(text) {
    if (serverStdoutChannel != null) {
      serverStdoutChannel.append(text);
    }
  };

  return [editorSideLogger, fsacStdOutWriter];
}

var patternInput_73 = createConfiguredLoggers("IONIDE-FSAC", "F# Language Service");
var log = exports.log = patternInput_73[0];
var fsacStdoutWriter = exports.fsacStdoutWriter = patternInput_73[1];

function genPort() {
  var r = Math.random();
  var r_ = r * (8999 - 8100) + 8100;
  return String(r_).substr(0, 4);
}

var port = exports.port = devMode ? "8088" : genPort();

function url(fsacAction, requestId) {
  return _fableCore.String.fsFormat("http://127.0.0.1:%s/%s?requestId=%i")(function (x) {
    return x;
  })(port)(fsacAction)(requestId);
}

var service = null;
var socket = null;
var platformPathSeparator = _Helpers.Process.isMono() ? "/" : "\\";

var makeRequestId = function () {
  var requestId = 0;
  return function () {
    requestId = requestId + 1;
    return requestId;
  };
}();

function relativePathForDisplay(path) {
  return _fableCore.String.replace(path, _vscode.workspace.rootPath + platformPathSeparator, "~" + platformPathSeparator);
}

function makeOutgoingLogPrefix(requestId) {
  return _fableCore.String.format("REQ ({0:000}) ->", requestId);
}

function makeIncomingLogPrefix(requestId) {
  return _fableCore.String.format("RES ({0:000}) <-", requestId);
}

function logOutgoingRequest(requestId, fsacAction, obj) {
  var extraPropInfo = obj.FileName != undefined ? [", File = \"%s\"", relativePathForDisplay(obj.FileName)] : obj.Project != undefined ? [", Project = \"%s\"", relativePathForDisplay(obj.Project)] : obj.Symbol != undefined ? [", Symbol = \"%s\"", obj.Symbol] : [null, null];

  var $target2 = function $target2() {
    _fableCore.String.fsFormat("cannot happen %A")(function (x) {
      throw x;
    })(extraPropInfo);
  };

  if (extraPropInfo[0] != null) {
    if (extraPropInfo[1] != null) {
      var extraArg = extraPropInfo[1];
      var extraTmpl = extraPropInfo[0];
      log.Info(makeOutgoingLogPrefix(requestId) + " {%s}" + extraTmpl + "\nData=%j", fsacAction, extraArg, obj);
    } else {
      $target2();
    }
  } else {
    if (extraPropInfo[1] == null) {
      log.Info(makeOutgoingLogPrefix(requestId) + " {%s}\nData=%j", fsacAction, obj);
    } else {
      $target2();
    }
  }
}

function logIncomingResponse(requestId, fsacAction, started, r, res, ex) {
  var elapsed = _fableCore.Date.op_Subtraction(_fableCore.Date.now(), started);

  var matchValue = [res, ex];

  var $target2 = function $target2() {
    log.Error(makeIncomingLogPrefix(requestId) + " {%s} ERROR in %s ms: %j, %j, %j", fsacAction, elapsed, res, _fableCore.Util.toString(ex), function () {
      return {};
    });
  };

  if (matchValue[0] == null) {
    if (matchValue[1] != null) {
      var ex_1 = matchValue[1];
      log.Error(makeIncomingLogPrefix(requestId) + " {%s} ERROR in %s ms: {%j}, Data=%j", fsacAction, elapsed, _fableCore.Util.toString(ex_1), function () {
        return {};
      });
    } else {
      $target2();
    }
  } else {
    if (matchValue[1] == null) {
      var res_1 = matchValue[0];
      var debugLog = [makeIncomingLogPrefix(requestId) + " {%s} in %s ms: Kind={\"%s\"}\nData=%j", [fsacAction, elapsed, res_1.Kind, res_1.Data]];
      var infoLog = [makeIncomingLogPrefix(requestId) + " {%s} in %s ms: Kind={\"%s\"} ", [fsacAction, elapsed, res_1.Kind]];
      (function (arg00) {
        return function (arg10) {
          log.DebugOrInfo(arg00, arg10);
        };
      })(debugLog)(infoLog);
    } else {
      $target2();
    }
  }
}

function logIncomingResponseError(requestId, fsacAction, started, r) {
  var elapsed = _fableCore.Date.op_Subtraction(_fableCore.Date.now(), started);

  log.Error(makeIncomingLogPrefix(requestId) + " {%s} ERROR in %s ms: %s Data=%j", fsacAction, elapsed, _fableCore.Util.toString(r), function () {
    return {};
  });
}

function request(fsacAction, id, requestId, obj) {
  var started = _fableCore.Date.now();

  var fullRequestUrl = url(fsacAction, requestId);
  logOutgoingRequest(requestId, fsacAction, obj);
  var options = {
    proxy: false
  };
  return _Helpers.Promise.map(function (r) {
    try {
      var res = function (arg00) {
        return JSON.parse(arg00);
      }(r.data[id]);

      logIncomingResponse(requestId, fsacAction, started, r, res);

      if (res.Kind === "error" ? true : res.Kind === "info") {
        return null;
      } else {
        return res;
      }
    } catch (ex) {
      logIncomingResponse(requestId, fsacAction, started, r, null, ex);
      return null;
    }
  }, _Helpers.Promise.onFail(function (r) {
    logIncomingResponseError(requestId, fsacAction, started, r);
  }, ax.post(fullRequestUrl, obj, options)));
}

function handleUntitled(fn) {
  return (_fableCore.String.endsWith(fn, ".fs") ? true : _fableCore.String.endsWith(fn, ".fsx")) ? fn : fn + ".fsx";
}

function project(s) {
  return request("project", 0, makeRequestId(), new _DTO.ProjectRequest(s));
}

function parseProjects(s) {
  return request("parseProjects", 0, makeRequestId(), new _DTO.ProjectRequest(s));
}

function parseProjectsInBackground(s) {
  return request("parseProjectsInBackground", 0, makeRequestId(), new _DTO.ProjectRequest(s));
}

function parse(path, text, version) {
  var lines = _fableCore.String.replace(text, "﻿", "").split("\n");

  return request("parse", 0, makeRequestId(), function () {
    var FileName = handleUntitled(path);
    return new _DTO.ParseRequest(FileName, true, lines, (version + 0x80000000 >>> 0) - 0x80000000);
  }());
}

function helptext(s) {
  return request("helptext", 0, makeRequestId(), new _DTO.HelptextRequest(s));
}

function completion(fn, sl, line, col, keywords) {
  return request("completion", 1, makeRequestId(), function () {
    var FileName = handleUntitled(fn);
    var Filter = "Contains";
    return new _DTO.CompletionRequest(FileName, sl, line, col, Filter, keywords);
  }());
}

function symbolUse(fn, line, col) {
  return request("symboluse", 0, makeRequestId(), new _DTO.PositionRequest(handleUntitled(fn), line, col, ""));
}

function symbolUseProject(fn, line, col) {
  return request("symboluseproject", 0, makeRequestId(), new _DTO.PositionRequest(handleUntitled(fn), line, col, ""));
}

function methods(fn, line, col) {
  return request("methods", 0, makeRequestId(), new _DTO.PositionRequest(handleUntitled(fn), line, col, ""));
}

function tooltip(fn, line, col) {
  return request("tooltip", 0, makeRequestId(), new _DTO.PositionRequest(handleUntitled(fn), line, col, ""));
}

function toolbar(fn, line, col) {
  return request("tooltip", 0, makeRequestId(), new _DTO.PositionRequest(handleUntitled(fn), line, col, ""));
}

function signature(fn, line, col) {
  return request("signature", 0, makeRequestId(), new _DTO.PositionRequest(handleUntitled(fn), line, col, ""));
}

function findDeclaration(fn, line, col) {
  return request("finddeclaration", 0, makeRequestId(), new _DTO.PositionRequest(handleUntitled(fn), line, col, ""));
}

function f1Help(fn, line, col) {
  return request("help", 0, makeRequestId(), new _DTO.PositionRequest(handleUntitled(fn), line, col, ""));
}

function declarations(fn, version) {
  return request("declarations", 0, makeRequestId(), new _DTO.DeclarationsRequest(handleUntitled(fn), version));
}

function declarationsProjects() {
  return request("declarationsProjects", 0, makeRequestId(), "");
}

function compilerLocation() {
  return request("compilerlocation", 0, makeRequestId(), "");
}

function lint(s) {
  return request("lint", 0, makeRequestId(), new _DTO.ProjectRequest(s));
}

function resolveNamespaces(fn, line, col) {
  return request("namespaces", 0, makeRequestId(), new _DTO.PositionRequest(handleUntitled(fn), line, col, ""));
}

function unionCaseGenerator(fn, line, col) {
  return request("unionCaseGenerator", 0, makeRequestId(), new _DTO.PositionRequest(handleUntitled(fn), line, col, ""));
}

function registerNotify(cb) {
  _fableCore.Seq.iterate(function (ws) {
    ws.on('message', function (res) {
      cb(Array.from(_fableCore.Seq.where(function (n) {
        return n.Kind !== "info" ? n.Kind !== "error" : false;
      }, _fableCore.Seq.map(function (json) {
        return _fableCore.Serialize.ofJson(json);
      }, _fableCore.Serialize.ofJson(res)))));
    });
  }, function () {
    var $var7 = socket;

    if ($var7 != null) {
      return [$var7];
    } else {
      return [];
    }
  }());
}

function startSocket() {
  var address = _fableCore.String.fsFormat("ws://localhost:%s/notify")(function (x) {
    return x;
  })(port);

  try {
    var sck = new _ws2.default(address);
    socket = sck;
  } catch (e) {
    socket = null;
    log.Error("Initializing notify error: %s", e);
  }
}

function start_(path) {
  return _Helpers.Promise.onFail(function (_arg1) {
    (function (arg00) {
      return _vscode.window.showErrorMessage(arg00);
    })(_Helpers.Process.isMono() ? "Failed to start language services. Please check if mono is in PATH" : "Failed to start language services. Please check if Microsoft Build Tools 2013 are installed");
  }, _Helpers.Promise.create(function (resolve) {
    return function (reject) {
      var child = _Helpers.Process.isMono() ? function () {
        var mono = _Utils.Configuration.get("mono", "FSharp.monoPath");

        return child_process.spawn(mono, [path, port]);
      }() : child_process.spawn(path, [port]);
      var isResolvedAsStarted = false;

      _Helpers.Process.onErrorOutput(function (n) {
        fsacStdoutWriter(_fableCore.Util.toString(n));

        if (!isResolvedAsStarted) {
          (function () {
            reject();
          })();
        }
      }, _Helpers.Process.onError(function (e) {
        fsacStdoutWriter(_fableCore.Util.toString(e));

        if (!isResolvedAsStarted) {
          (function () {
            reject();
          })();
        }
      }, _Helpers.Process.onOutput(function (n) {
        var outputString = _fableCore.Util.toString(n);

        var isStartedMessage = outputString.indexOf("listener started in") >= 0;

        if (isStartedMessage) {
          fsacStdoutWriter("Resolving startup promise because FSAC printed the 'listener started' message");
          fsacStdoutWriter("\n");
          service = child;
          resolve(child);
          isResolvedAsStarted = true;
        }

        fsacStdoutWriter(outputString);
      }, child)));
    };
  }));
}

exports.start$27 = start_;

function start() {
  var path = function () {
    try {
      return _Helpers.VSCode.getPluginPath("Ionide.ionide-fsharp") + "/bin/FsAutoComplete.Suave.exe";
    } catch (matchValue) {
      return _Helpers.VSCode.getPluginPath("Ionide.Ionide-fsharp") + "/bin/FsAutoComplete.Suave.exe";
    }
  }();

  if (devMode) {
    return _Helpers.Promise.empty();
  } else {
    return start_(path);
  }
}

function stop() {
  _fableCore.Seq.iterate(function (n) {
    n.kill("SIGKILL");
  }, function () {
    var $var8 = service;

    if ($var8 != null) {
      return [$var8];
    } else {
      return [];
    }
  }());

  service = null;
}