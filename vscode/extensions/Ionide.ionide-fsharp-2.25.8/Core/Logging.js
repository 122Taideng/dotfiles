"use strict";

exports.__esModule = true;
exports.ConsoleAndOutputChannelLogger = exports.Level = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fableCore = require("fable-core");

var _util = require("util");

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Level = exports.Level = function () {
  function Level(caseName, fields) {
    _classCallCheck(this, Level);

    this.Case = caseName;
    this.Fields = fields;
  }

  Level.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsUnions(this, other);
  };

  Level.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareUnions(this, other);
  };

  Level.prototype.ToString = function ToString() {
    return this.Case === "INFO" ? "INFO" : this.Case === "WARN" ? "WARN" : this.Case === "DEBUG" ? "DEBUG" : "ERROR";
  };

  Level.prototype.isGreaterOrEqualTo = function isGreaterOrEqualTo(level) {
    return Level.GetLevelNum(this) >= Level.GetLevelNum(level);
  };

  Level.prototype.isLessOrEqualTo = function isLessOrEqualTo(level) {
    return Level.GetLevelNum(this) <= Level.GetLevelNum(level);
  };

  _createClass(Level, null, [{
    key: "GetLevelNum",
    get: function get() {
      return function (_arg1) {
        return _arg1.Case === "INFO" ? 20 : _arg1.Case === "WARN" ? 30 : _arg1.Case === "ERROR" ? 40 : 10;
      };
    }
  }]);

  return Level;
}();

_fableCore.Util.setInterfaces(Level.prototype, ["FSharpUnion", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.Logging.Level");

function writeDevToolsConsole(level, source, template, args) {
  var _console;

  var browserLogTemplate = _fableCore.String.format("[{0}] {1}", _fableCore.Util.toString(source), _fableCore.String.replace(template, "%j", "%O"));

  var matchValue = args.length;

  switch (matchValue) {
    case 0:
      console.log(browserLogTemplate);
      break;

    case 1:
      console.log(browserLogTemplate, args[0]);
      break;

    case 2:
      console.log(browserLogTemplate, args[0], args[1]);
      break;

    case 3:
      console.log(browserLogTemplate, args[0], args[1], args[2]);
      break;

    case 4:
      console.log(browserLogTemplate, args[0], args[1], args[2], args[3]);
      break;

    default:
      (_console = console).log.apply(_console, [browserLogTemplate].concat(args));

  }
}

function writeOutputChannel(out, level, source, template, args) {
  var formattedMessage = util.format.apply(util, [template].concat(args));

  var formattedLogLine = _fableCore.String.format("[{0:HH:mm:ss} {1,-5}] {2}", _fableCore.Date.now(), _fableCore.Util.toString(level), formattedMessage);

  out.appendLine(formattedLogLine);
}

function writeBothIfConfigured(out, chanMinLevel, consoleMinLevel, level, source, template, args) {
  if (function () {
    return consoleMinLevel != null;
  }() ? level.isGreaterOrEqualTo(consoleMinLevel) : false) {
    writeDevToolsConsole(level, source, template, args);
  }

  if (function () {
    return out != null;
  }() ? level.isGreaterOrEqualTo(chanMinLevel) : false) {
    writeOutputChannel(out, level, source, template, args);
  }
}

var ConsoleAndOutputChannelLogger = exports.ConsoleAndOutputChannelLogger = function () {
  function ConsoleAndOutputChannelLogger(source, chanMinLevel, out, consoleMinLevel) {
    _classCallCheck(this, ConsoleAndOutputChannelLogger);

    this.source = source;
    this.chanMinLevel = chanMinLevel;
    this.out = out;
    this.consoleMinLevel = consoleMinLevel;
  }

  ConsoleAndOutputChannelLogger.prototype.DebugOrInfo = function DebugOrInfo(debugTemplateAndArgs, infoTemplateAndArgs) {
    var _this = this;

    if (function () {
      return _this.out != null;
    }()) {
      if (this.chanMinLevel.isLessOrEqualTo(new Level("DEBUG", []))) {
        writeOutputChannel(this.out, new Level("DEBUG", []), this.source, debugTemplateAndArgs[0], debugTemplateAndArgs[1]);
      } else {
        if (this.chanMinLevel.isLessOrEqualTo(new Level("INFO", []))) {
          writeOutputChannel(this.out, new Level("INFO", []), this.source, infoTemplateAndArgs[0], infoTemplateAndArgs[1]);
        }
      }
    }

    if (function () {
      return _this.consoleMinLevel != null;
    }()) {
      if (new Level("DEBUG", []).isGreaterOrEqualTo(this.consoleMinLevel)) {
        writeDevToolsConsole(new Level("DEBUG", []), this.source, debugTemplateAndArgs[0], debugTemplateAndArgs[1]);
      } else {
        if (new Level("INFO", []).isGreaterOrEqualTo(this.consoleMinLevel)) {
          writeDevToolsConsole(new Level("INFO", []), this.source, infoTemplateAndArgs[0], infoTemplateAndArgs[1]);
        }
      }
    }
  };

  ConsoleAndOutputChannelLogger.prototype.Debug = function Debug(template) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    writeBothIfConfigured(this.out, this.chanMinLevel, this.consoleMinLevel, new Level("DEBUG", []), this.source, template, args);
  };

  ConsoleAndOutputChannelLogger.prototype.Info = function Info(template) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    writeBothIfConfigured(this.out, this.chanMinLevel, this.consoleMinLevel, new Level("INFO", []), this.source, template, args);
  };

  ConsoleAndOutputChannelLogger.prototype.Error = function Error(template) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    writeBothIfConfigured(this.out, this.chanMinLevel, this.consoleMinLevel, new Level("ERROR", []), this.source, template, args);
  };

  ConsoleAndOutputChannelLogger.prototype.Warn = function Warn(template) {
    for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    writeBothIfConfigured(this.out, this.chanMinLevel, this.consoleMinLevel, new Level("WARN", []), this.source, template, args);
  };

  return ConsoleAndOutputChannelLogger;
}();

_fableCore.Util.setInterfaces(ConsoleAndOutputChannelLogger.prototype, [], "Ionide.VSCode.FSharp.Logging.ConsoleAndOutputChannelLogger");