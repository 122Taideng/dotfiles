"use strict";

exports.__esModule = true;
exports.Breakpoint = exports.BreakpointStatus = exports.Continue = exports.Variable = exports.StackFrame = exports.Thread = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.spawn = spawn;
exports.close = close;
exports.config = config;
exports.start = start;
exports.getPid = getPid;
exports.attach = attach;
exports.findThread = findThread;
exports.go = go;
exports.next = next;
exports.stepIn = stepIn;
exports.stepOut = stepOut;
exports.setBreakpoint = setBreakpoint;
exports.deleteBreakpoint = deleteBreakpoint;
exports.getThreads = getThreads;
exports.getStack = getStack;
exports.getVariables = getVariables;
exports.getVariable = getVariable;

var _fableCore = require("fable-core");

var _path = require("path");

var path_1 = _interopRequireWildcard(_path);

var _Helpers = require("./Helpers");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Thread = exports.Thread = function () {
  function Thread(id, name) {
    _classCallCheck(this, Thread);

    this.id = id;
    this.name = name;
  }

  Thread.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Thread.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Thread;
}();

_fableCore.Util.setInterfaces(Thread.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Mdbg.Thread");

var StackFrame = exports.StackFrame = function () {
  function StackFrame(id, name, source, line) {
    _classCallCheck(this, StackFrame);

    this.id = id;
    this.name = name;
    this.source = source;
    this.line = line;
  }

  StackFrame.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  StackFrame.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return StackFrame;
}();

_fableCore.Util.setInterfaces(StackFrame.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Mdbg.StackFrame");

var Variable = exports.Variable = function () {
  function Variable(name, value) {
    _classCallCheck(this, Variable);

    this.name = name;
    this.value = value;
  }

  Variable.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Variable.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Variable;
}();

_fableCore.Util.setInterfaces(Variable.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Mdbg.Variable");

var Continue = exports.Continue = function () {
  function Continue(caseName, fields) {
    _classCallCheck(this, Continue);

    this.Case = caseName;
    this.Fields = fields;
  }

  Continue.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsUnions(this, other);
  };

  Continue.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareUnions(this, other);
  };

  return Continue;
}();

_fableCore.Util.setInterfaces(Continue.prototype, ["FSharpUnion", "System.IEquatable", "System.IComparable"], "Mdbg.Continue");

var BreakpointStatus = exports.BreakpointStatus = function () {
  function BreakpointStatus(caseName, fields) {
    _classCallCheck(this, BreakpointStatus);

    this.Case = caseName;
    this.Fields = fields;
  }

  BreakpointStatus.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsUnions(this, other);
  };

  BreakpointStatus.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareUnions(this, other);
  };

  return BreakpointStatus;
}();

_fableCore.Util.setInterfaces(BreakpointStatus.prototype, ["FSharpUnion", "System.IEquatable", "System.IComparable"], "Mdbg.BreakpointStatus");

var Breakpoint = exports.Breakpoint = function () {
  function Breakpoint(id, line, file, status) {
    _classCallCheck(this, Breakpoint);

    this.id = id;
    this.line = line;
    this.file = file;
    this.status = status;
  }

  Breakpoint.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Breakpoint.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Breakpoint;
}();

_fableCore.Util.setInterfaces(Breakpoint.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Mdbg.Breakpoint");

var debugProcess = null;

var resolve = function resolve(value) {
  value;
};

var reject = function reject(value) {
  value;
};

var answer = "";
var busy = false;

function spawn(dir) {
  var mdbgPath = path_1.join(dir, "bin_mdbg", "mdbg.exe");

  var proc = _Helpers.Process.onErrorOutput(function (n) {
    _fableCore.Seq.iterate(function (rej) {
      _Helpers.Helpers.log("{ ERROR }\n" + answer);

      var output = _fableCore.Util.toString(n);

      rej(answer);
      resolve = null;
      reject = null;
      answer = "";
      busy = false;
    }, function () {
      var $var1 = reject;

      if ($var1 != null) {
        return [$var1];
      } else {
        return [];
      }
    }());
  }, _Helpers.Process.onOutput(function (n) {
    _fableCore.Seq.iterate(function (res) {
      var output = _fableCore.Util.toString(n);

      answer = answer + output;

      if (answer.indexOf("mdbg>") >= 0) {
        _Helpers.Helpers.log("{ ANSWER }\n" + answer);

        res(answer);
        resolve = null;
        reject = null;
        answer = "";
        busy = false;
      }
    }, function () {
      var $var2 = resolve;

      if ($var2 != null) {
        return [$var2];
      } else {
        return [];
      }
    }());
  }, _Helpers.Process.spawn(mdbgPath)));

  debugProcess = proc;
  busy = true;
}

function close() {
  busy = false;

  resolve = function resolve(value) {
    value;
  };

  reject = function reject(value) {
    value;
  };

  answer = "";

  _fableCore.Seq.iterate(function (p) {
    p.kill();
  }, function () {
    var $var3 = debugProcess;

    if ($var3 != null) {
      return [$var3];
    } else {
      return [];
    }
  }());
}

function delay(ms) {
  return _Helpers.Promise.create(function (res) {
    return function (rej) {
      setTimeout(res, ms);
    };
  });
}

function send(cmd) {
  return !busy ? debugProcess != null ? function () {
    var dp = debugProcess;

    _Helpers.Helpers.log("{ REQ SEND } " + cmd);

    busy = true;
    {
      dp.stdin.write(cmd + "\n");
    }
    return _Helpers.Promise.create(function (res) {
      return function (rej) {
        resolve = res;

        reject = function reject(arg00) {
          rej(arg00);
        };
      };
    });
  }() : _Helpers.Promise.reject("Mdbg not started") : function () {
    _Helpers.Helpers.log("{ REQ WAITING } " + cmd);

    return _Helpers.Promise.bind(function (_arg1) {
      return send(cmd);
    }, delay(100));
  }();
}

function config() {
  return _Helpers.Promise.map(function (value) {
    value;
  }, send("mo nc on"));
}

function start(path) {
  return _Helpers.Promise.map(function (value) {
    value;
  }, send(_fableCore.String.fsFormat("r %s")(function (x) {
    return x;
  })(path)));
}

function getPid(program) {
  var programName = path_1.basename(program);
  return _Helpers.Promise.map(function (res) {
    var line = res.split("\n").find(function (n) {
      return n.indexOf(programName) >= 0;
    });
    var pid = line.split(")")[0].substr(6);
    return Number.parseInt(pid);
  }, send("a"));
}

function attach(pid) {
  return _Helpers.Promise.map(function (value) {
    value;
  }, send(_fableCore.String.fsFormat("a %d")(function (x) {
    return x;
  })(pid)));
}

function findThread(res) {
  var line = res.split("\n").find(function (n) {
    return n.indexOf("mdbg>") >= 0;
  });
  return Number.parseFloat(line.split(",")[1].split("]")[0].split(":")[1]);
}

function go() {
  return _Helpers.Promise.map(function (res) {
    return res.indexOf("STOP: Process Exited") >= 0 ? new Continue("Terminated", []) : res.indexOf("STOP: Breakpoint") >= 0 ? function () {
      var thread = findThread(res);
      return new Continue("Breakpoint", [thread]);
    }() : new Continue("Exception", [0]);
  }, send("go"));
}

function next() {
  return function (pr) {
    return _Helpers.Promise.map(function (res) {
      return findThread(res);
    }, pr);
  }(send("n"));
}

function stepIn() {
  return function (pr) {
    return _Helpers.Promise.map(function (res) {
      return findThread(res);
    }, pr);
  }(send("s"));
}

function stepOut() {
  return function (pr) {
    return _Helpers.Promise.map(function (res) {
      return findThread(res);
    }, pr);
  }(send("u"));
}

function setBreakpoint(file, line) {
  return _Helpers.Promise.map(function (res) {
    var ln = res.split("\n")[0];
    var x = ln.split("#");
    var id = Number.parseFloat(x[1].split(" ")[0]);
    var state = ln.indexOf("unbound") >= 0 ? new BreakpointStatus("Unbound", []) : new BreakpointStatus("Bound", []);
    return new Breakpoint(id, line, file, state);
  }, send(_fableCore.String.fsFormat("b %s:%d")(function (x) {
    return x;
  })(file)(line)));
}

function deleteBreakpoint(id) {
  return send(_fableCore.String.fsFormat("del %d")(function (x) {
    return x;
  })(id));
}

function getThreads() {
  var parseThread = function parseThread(line) {
    try {
      var thread = line.split("(");

      var name = _fableCore.String.trim(thread[0], "both");

      var id = Number.parseFloat(name.split(":")[1]);
      return new Thread(id, name);
    } catch (matchValue) {
      return null;
    }
  };

  return _Helpers.Promise.map(function (res) {
    return function (array) {
      return Array.from(_fableCore.Seq.choose(parseThread, array));
    }(Array.from(_fableCore.Seq.where(function (s) {
      return s.indexOf("th") === 0;
    }, res.split("\n").map(function (s) {
      return _fableCore.String.trim(s, "both");
    }))));
  }, send("t"));
}

function getStack(depth, thread) {
  var parseStackFrame = function parseStackFrame(line) {
    try {
      var _ret = function () {
        var ns = _fableCore.String.split(line, [". "], null, 1);

        var id = Number.parseFloat(_fableCore.String.replace(ns[0], "*", ""));
        var xs = ns[1].split("(");

        var name = _fableCore.String.trim(xs[0], "both");

        var location = _fableCore.String.replace(xs[1], ")", "");

        var patternInput = location === "source line information unavailable" ? [null, 0] : function () {
          var getExtension = function getExtension(lc) {
            return lc.indexOf(".fs") >= 0 ? ".fs" : lc.indexOf(".fsx") >= 0 ? ".fsx" : lc.indexOf(".cs") >= 0 ? ".cs" : "";
          };

          var locs = _fableCore.String.split(location, [".fs:", ".cs:", ".fsx:"], null, 1);

          var p = locs[0] + getExtension(location);
          var line_1 = Number.parseFloat(locs[1]);
          return [p, line_1];
        }();
        return {
          v: new StackFrame(id, name, patternInput[0], patternInput[1])
        };
      }();

      if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    } catch (matchValue) {
      return null;
    }
  };

  return _Helpers.Promise.map(function (res) {
    return function (array) {
      return Array.from(_fableCore.Seq.choose(parseStackFrame, array));
    }(Array.from(_fableCore.Seq.where(function (s) {
      return !(s.indexOf("mdbg>") >= 0);
    }, res.split("\n").map(function (s) {
      return _fableCore.String.trim(s, "both");
    }))));
  }, send(_fableCore.String.fsFormat("w -c %d %d")(function (x) {
    return x;
  })(depth)(thread)));
}

function getVariables() {
  var parseVariable = function parseVariable(line) {
    var ls = line.split("=");
    return new Variable(ls[0], ls[1]);
  };

  return _Helpers.Promise.map(function (res) {
    return function (array) {
      return array.map(parseVariable);
    }(Array.from(_fableCore.Seq.where(function (s) {
      return !(s.indexOf("mdbg") >= 0);
    }, res.split("\n").map(function (s) {
      return _fableCore.String.trim(s, "both");
    }))));
  }, send("p"));
}

function getVariable(item) {
  return _Helpers.Promise.map(function (res) {
    return res.split("\n")[0];
  }, send(_fableCore.String.fsFormat("p %s")(function (x) {
    return x;
  })(item)));
}