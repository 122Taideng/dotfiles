"use strict";

exports.__esModule = true;
exports.ignoredDecorationType = exports.passedDecorationType = exports.failedDecorationType = undefined;
exports.getFilesToWatch = getFilesToWatch;
exports.parseTestSummaryRecord = parseTestSummaryRecord;
exports.activate = activate;

var _vscode = require("vscode");

var _Logging = require("./../Core/Logging");

var _fableCore = require("fable-core");

var _Utils = require("./../Core/Utils");

var _Project = require("./../Core/Project");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _Environment = require("./Environment");

var outputChannel = _vscode.window.createOutputChannel("Expecto");

var lastOutput = new Map();
var logger = new _Logging.ConsoleAndOutputChannelLogger("Expecto", new _Logging.Level("DEBUG", []), null, new _Logging.Level("DEBUG", []));
var watcherEnabled = false;

var statusBar = _vscode.window.createStatusBarItem(2, 100);

function getAutoshow() {
  var cfg = _vscode.workspace.getConfiguration();

  return cfg.get("Expecto.autoshow", true);
}

function getSequenced() {
  var cfg = _vscode.workspace.getConfiguration();

  return cfg.get("Expecto.runSequenced", false);
}

function getDebug() {
  var cfg = _vscode.workspace.getConfiguration();

  return cfg.get("Expecto.runDebug", false);
}

function getVersion() {
  var cfg = _vscode.workspace.getConfiguration();

  return cfg.get("Expecto.runVersion", false);
}

function getFailOnFocusedTests() {
  var cfg = _vscode.workspace.getConfiguration();

  return cfg.get("Expecto.runFailOnFocusedTests", false);
}

function getCustomArgs() {
  var cfg = _vscode.workspace.getConfiguration();

  return cfg.get("Expecto.customArgs", "");
}

function getExpectoProjects() {
  return _fableCore.Seq.toList(_fableCore.Seq.where(function (p) {
    return _fableCore.Seq.exists(function () {
      var ending = "Expecto.dll";
      return function (s) {
        return _Utils.String.endWith(ending, s);
      };
    }(), p.References);
  }, (0, _Project.getLoaded)()));
}

function getExpectoExes() {
  return _fableCore.List.where(function () {
    var ending = ".exe";
    return function (s) {
      return _Utils.String.endWith(ending, s);
    };
  }(), _fableCore.List.map(function (n) {
    return n.Output;
  }, getExpectoProjects()));
}

function getFilesToWatch() {
  var projects = Array.from((0, _Project.getLoaded)());

  var getProject = function getProject(ref) {
    return _fableCore.Seq.tryFind(function (p) {
      return p.Output.toLocaleLowerCase() === ref.toLocaleLowerCase();
    }, projects);
  };

  var loop = function loop(p) {
    return _fableCore.Seq.toList(_fableCore.Seq.delay(function () {
      return _fableCore.Seq.append(_fableCore.Seq.singleton(p.Project), _fableCore.Seq.delay(function () {
        return _fableCore.Seq.append(p.Files, _fableCore.Seq.delay(function () {
          return _fableCore.List.collect(function (ref) {
            var matchValue = getProject(ref);

            if (matchValue != null) {
              return loop(matchValue);
            } else {
              return _fableCore.List.ofArray([ref]);
            }
          }, p.References);
        }));
      }));
    }));
  };

  return Array.from(_fableCore.Seq.toList(_fableCore.Seq.distinct(function (list) {
    return _fableCore.List.collect(loop, list);
  }(getExpectoProjects()))));
}

function handleExpectoList(error, stdout, stderr) {
  return stdout.toString() === "" ? [] : stdout.toString().split("\n").filter(function () {
    var x = "";
    return function (y) {
      return x !== y;
    };
  }()).map(function (n) {
    return _fableCore.String.trim(n, "both");
  });
}

function parseTestSummaryRecord(n) {
  var split = n.split("[");

  var loc = _Utils.String.replace("]", "", split[1]);

  return [split[0], loc];
}

function getFailed() {
  _fableCore.String.fsFormat("last output: %O")(function (x) {
    console.log(x);
  })(lastOutput);

  return Array.from(_fableCore.Seq.map(function (tupledArg) {
    return tupledArg[0].indexOf(" ") >= 0 ? [_fableCore.String.fsFormat("\"%s\"")(function (x) {
      return x;
    })(tupledArg[0]), tupledArg[1]] : [tupledArg[0], tupledArg[1]];
  }, _fableCore.Seq.collect(function (kv) {
    return function (source) {
      return _fableCore.Seq.map(function (n) {
        return parseTestSummaryRecord(n);
      }, source);
    }(_fableCore.Seq.filter(function ($var37) {
      return !_fableCore.String.isNullOrWhiteSpace($var37);
    }, _fableCore.Seq.filter(function ($var38) {
      return !_Utils.String.startWith("Errored:", $var38);
    }, _fableCore.Seq.filter(function ($var39) {
      return !_Utils.String.startWith("Failed:", $var39);
    }, _fableCore.Seq.skipWhile(function ($var40) {
      return !_Utils.String.startWith("Failed:", $var40);
    }, function (source) {
      return _fableCore.Seq.map(function (s) {
        return _Utils.String.trim(s);
      }, source);
    }(kv[1].split("\n")))))));
  }, lastOutput)));
}

function getPassed() {
  return Array.from(_fableCore.Seq.map(function (tupledArg) {
    return tupledArg[0].indexOf(" ") >= 0 ? [_fableCore.String.fsFormat("\"%s\"")(function (x) {
      return x;
    })(tupledArg[0]), tupledArg[1]] : [tupledArg[0], tupledArg[1]];
  }, _fableCore.Seq.collect(function (kv) {
    return function (source) {
      return _fableCore.Seq.map(function (n) {
        return parseTestSummaryRecord(n);
      }, source);
    }(_fableCore.Seq.skip(1, _fableCore.Seq.takeWhile(function ($var41) {
      return !_Utils.String.startWith("Ignored:", $var41);
    }, _fableCore.Seq.skipWhile(function ($var42) {
      return !_Utils.String.startWith("Passed:", $var42);
    }, function (source) {
      return _fableCore.Seq.map(function (s) {
        return _Utils.String.trim(s);
      }, source);
    }(kv[1].split("\n"))))));
  }, lastOutput)));
}

function getIgnored() {
  return Array.from(_fableCore.Seq.map(function (tupledArg) {
    return tupledArg[0].indexOf(" ") >= 0 ? [_fableCore.String.fsFormat("\"%s\"")(function (x) {
      return x;
    })(tupledArg[0]), tupledArg[1]] : [tupledArg[0], tupledArg[1]];
  }, _fableCore.Seq.collect(function (kv) {
    return function (source) {
      return _fableCore.Seq.map(function (n) {
        return parseTestSummaryRecord(n);
      }, source);
    }(_fableCore.Seq.skip(1, _fableCore.Seq.takeWhile(function ($var43) {
      return !_Utils.String.startWith("Failed:", $var43);
    }, _fableCore.Seq.skipWhile(function ($var44) {
      return !_Utils.String.startWith("Ignored:", $var44);
    }, function (source) {
      return _fableCore.Seq.map(function (s) {
        return _Utils.String.trim(s);
      }, source);
    }(kv[1].split("\n"))))));
  }, lastOutput)));
}

var failedDecorationType = exports.failedDecorationType = function () {
  var opt = {};
  var file = "testFailed.png";

  var path = function () {
    try {
      return _vscode.Uri.file(_Helpers.VSCode.getPluginPath("Ionide.ionide-fsharp") + "/images/" + file);
    } catch (matchValue) {
      return _vscode.Uri.file(_Helpers.VSCode.getPluginPath("Ionide.Ionide-fsharp") + "/images/" + file);
    }
  }();

  opt.gutterIconPath = path;
  opt.overviewRulerLane = 7;
  opt.overviewRulerColor = "rgba(224, 64, 6, 0.7)";
  return _vscode.window.createTextEditorDecorationType(opt);
}();

var passedDecorationType = exports.passedDecorationType = function () {
  var opt = {};
  var file = "testPassed.png";

  var path = function () {
    try {
      return _vscode.Uri.file(_Helpers.VSCode.getPluginPath("Ionide.ionide-fsharp") + "/images/" + file);
    } catch (matchValue) {
      return _vscode.Uri.file(_Helpers.VSCode.getPluginPath("Ionide.Ionide-fsharp") + "/images/" + file);
    }
  }();

  opt.gutterIconPath = path;
  opt.overviewRulerLane = 7;
  opt.overviewRulerColor = "rgba(166, 215, 133, 0.7)";
  return _vscode.window.createTextEditorDecorationType(opt);
}();

var ignoredDecorationType = exports.ignoredDecorationType = function () {
  var opt = {};
  var file = "testIgnored.png";

  var path = function () {
    try {
      return _vscode.Uri.file(_Helpers.VSCode.getPluginPath("Ionide.ionide-fsharp") + "/images/" + file);
    } catch (matchValue) {
      return _vscode.Uri.file(_Helpers.VSCode.getPluginPath("Ionide.Ionide-fsharp") + "/images/" + file);
    }
  }();

  opt.gutterIconPath = path;
  opt.overviewRulerLane = 7;
  opt.overviewRulerColor = "rgba(255, 188, 64, 0.7)";
  return _vscode.window.createTextEditorDecorationType(opt);
}();

function setDecorations() {
  var transform = function transform($var46) {
    return function () {
      return function () {
        var mapping = function mapping(tupledArg) {
          return [_vscode.Uri.file(tupledArg[0]), Array.from(_fableCore.Seq.choose(function (tupledArg_1) {
            return Number.parseInt(tupledArg_1[1]) > 1 ? new _vscode.Range(Number.parseFloat(tupledArg_1[1]) - 1, 0, Number.parseFloat(tupledArg_1[1]) - 1, 0) : null;
          }, tupledArg[1]))];
        };

        return function (array) {
          return array.map(mapping);
        };
      }();
    }()(function ($var45) {
      return Array.from(_fableCore.Seq.groupBy(function (tuple) {
        return tuple[0];
      }, $var45.map(function (tupledArg) {
        var split = _Utils.String.split([":"], tupledArg[1]);

        var leng = split.length;

        var fn = _fableCore.String.join(":", split.slice(0, leng - 2 + 1));

        var line = split[leng - 1];
        return [fn, line];
      })));
    }($var46));
  };

  var get = function get(fn) {
    return function (data) {
      try {
        return Array.from(_fableCore.Seq.ofArray(data.find(function (tupledArg) {
          return _vscode.Uri.file(fn).fsPath === tupledArg[0].fsPath;
        })[1]));
      } catch (matchValue) {
        return [];
      }
    };
  };

  var failed = function failed(fn) {
    return get(fn)(transform(getFailed()));
  };

  var passed = function passed(fn) {
    return get(fn)(transform(getPassed()));
  };

  var ignored = function ignored(fn) {
    return get(fn)(transform(getIgnored()));
  };

  _fableCore.Seq.iterate(function (te) {
    var matchValue = te.document;

    var activePatternResult2870 = _Utils.Document.$FSharp$CSharp$VB$Other$(matchValue);

    if (activePatternResult2870.Case === "Choice1Of4") {
      var fld = failed(te.document.fileName);
      te.setDecorations(failedDecorationType, fld);
      var psd = passed(te.document.fileName);
      te.setDecorations(passedDecorationType, psd);
      var ign = ignored(te.document.fileName);
      te.setDecorations(ignoredDecorationType, ign);
    }
  }, _vscode.window.visibleTextEditors);
}

function buildExpectoProjects(watchMode) {
  outputChannel.clear();

  if (getAutoshow() ? !watchMode : false) {
    outputChannel.show();
  } else {
    if (watchMode) {
      statusBar.text = "$(eye) Watch Mode - building";
    }
  }

  return _Helpers.Promise.bind(function (codes) {
    return _fableCore.Seq.exists(function () {
      var x = "0";
      return function (y) {
        return x !== y;
      };
    }(), codes) ? !watchMode ? _Helpers.Promise.map(function () {
      return false;
    }, _Helpers.Promise.map(function (n) {
      if (n === "Show") {
        outputChannel.show();
      }
    }, _vscode.window.showErrorMessage("Build of Expecto tests failed", "Show"))) : function () {
      statusBar.text = "$(eye) Watch Mode - building failed";
      return _Helpers.Promise.empty();
    }() : _Helpers.Promise.lift(true);
  }, _Helpers.Promise.all(_fableCore.List.map(function (proj) {
    return function (builder_) {
      return _Helpers.Promise.bind(function (_arg1) {
        logger.Debug("%s %s", _arg1, proj.Project);
        return _Helpers.Process.toPromise(_Helpers.Process.spawnWithNotification(_arg1, "", proj.Project, outputChannel));
      }, _Environment.msbuild);
    }(_Helpers.PromiseBuilderImp.promise);
  }, getExpectoProjects())));
}

function runExpecto(watchMode, args) {
  outputChannel.clear();

  if (getAutoshow() ? !watchMode : false) {
    outputChannel.show();
  } else {
    if (watchMode) {
      statusBar.text = "$(eye) Watch Mode - running";
    }
  }

  var args_1 = getSequenced() ? args + " --sequenced" : args;
  var args_2 = getDebug() ? args_1 + " --debug" : args_1;
  var args_3 = getVersion() ? args_2 + " --version" : args_2;
  var args_4 = getFailOnFocusedTests() ? args_3 + " --fail-on-focused-tests" : args_3;
  var customArgs = getCustomArgs();
  var args_5 = customArgs !== "" ? customArgs + " " + args_4 : args_4;
  return _Helpers.Promise.bind(function (res) {
    return res ? function () {
      lastOutput.clear();
      return _Helpers.Promise.bind(function (codes) {
        setDecorations();

        if (_fableCore.Seq.exists(function () {
          var x = "0";
          return function (y) {
            return x !== y;
          };
        }(), codes)) {
          if (!watchMode) {
            return _Helpers.Promise.map(function (n) {
              if (n === "Show") {
                outputChannel.show();
              }
            }, _vscode.window.showErrorMessage("Expecto tests failed", "Show"));
          } else {
            var failed = Array.from(getFailed());
            statusBar.text = _fableCore.String.fsFormat("$(eye) Watch Mode - %d tests failed")(function (x) {
              return x;
            })(failed.length);
            return _Helpers.Promise.empty();
          }
        } else {
          if (watchMode) {
            statusBar.text = "$(eye) Watch Mode - tests passed";
          }

          return _Helpers.Promise.empty();
        }
      }, _Helpers.Promise.all(_fableCore.List.map(function (exe) {
        logger.Debug("%s %s", exe, args_5);
        lastOutput.set(exe, "");
        return _Helpers.Process.toPromise(_Helpers.Process.onOutput(function (out) {
          lastOutput.set(exe, lastOutput.get(exe) + _fableCore.Util.toString(out));
        }, _Helpers.Process.spawnWithNotificationInDir(exe, "mono", args_5, outputChannel)));
      }, getExpectoExes())));
    }() : _Helpers.Promise.empty();
  }, buildExpectoProjects(watchMode));
}

function runAll(watchMode) {
  return runExpecto(watchMode, "--summary-location");
}

function getTestCases() {
  return _Helpers.Promise.bind(function (res) {
    return res ? _Helpers.Promise.map(function ($var47) {
      return Array.from(_fableCore.Seq.collect(function (tupledArg) {
        return handleExpectoList(tupledArg[0], tupledArg[1], tupledArg[2]);
      }, $var47));
    }, _Helpers.Promise.all(_fableCore.List.map(function (exe) {
      return _Helpers.Process.exec(exe, "mono", "--list-tests");
    }, getExpectoExes()))) : _Helpers.Promise.lift([]);
  }, buildExpectoProjects(false));
}

function getTestLists() {
  var getTestList = function getTestList(s) {
    var all = s.split("/");

    if (all.length === 0) {
      return "";
    } else {
      if (all.length === 1) {
        var x = all[0];
        return "";
      } else {
        return _fableCore.String.join("/", all.slice(0, all.length - 2 + 1));
      }
    }
  };

  return _Helpers.Promise.map(function ($var50) {
    return function (arg00) {
      return Array.from(arg00);
    }(function ($var49) {
      return function () {
        return function () {
          var predicate = function () {
            var x = "";
            return function (y) {
              return x !== y;
            };
          }();

          return function (source) {
            return _fableCore.Seq.filter(predicate, source);
          };
        }();
      }()(function ($var48) {
        return function (source) {
          return _fableCore.Seq.distinct(source);
        }(function (source) {
          return _fableCore.Seq.map(getTestList, source);
        }($var48));
      }($var49));
    }($var50));
  }, getTestCases());
}

function runSingle() {
  return _Helpers.Promise.bind(function (n) {
    return n != undefined ? runExpecto(false, _fableCore.String.fsFormat("--run \"%s\"")(function (x) {
      return x;
    })(n)) : _Helpers.Promise.empty();
  }, _vscode.window.showQuickPick(getTestCases()));
}

function runList() {
  return _Helpers.Promise.bind(function (n) {
    return n != undefined ? runExpecto(false, _fableCore.String.fsFormat("--filter \"%s\" --summary-location")(function (x) {
      return x;
    })(n)) : _Helpers.Promise.empty();
  }, _vscode.window.showQuickPick(getTestLists()));
}

function runFailed() {
  return runExpecto(false, _fableCore.String.fsFormat("--run %s --summary-location")(function (x) {
    return x;
  })(_fableCore.String.join(" ", _fableCore.Seq.map(function (tuple) {
    return tuple[0];
  }, getFailed()))));
}

function startWatchMode() {
  statusBar.text = "$(eye) Watch Mode On";
  watcherEnabled = true;
  return runAll(true);
}

function stopWatchMode() {
  statusBar.text = "$(eye) Watch Mode Off";
  watcherEnabled = false;
}

function onFileChanged(uri) {
  var files = getFilesToWatch();

  if (watcherEnabled ? files.some(function (n) {
    return uri.fsPath === n;
  }) : false) {
    return runAll(true);
  } else {
    return _Helpers.Promise.empty();
  }
}

function activate(disposables) {
  var registerCommand = function registerCommand(com) {
    return function (f) {
      _vscode.commands.registerCommand(com, f);
    };
  };

  registerCommand("Expecto.run")(function () {
    return runAll(false);
  });
  registerCommand("Expecto.runSingle")(function () {
    return runSingle();
  });
  registerCommand("Expecto.runList")(function () {
    return runList();
  });
  registerCommand("Expecto.runFailed")(function () {
    return runFailed();
  });
  registerCommand("Expecto.startWatchMode")(function () {
    return startWatchMode();
  });
  registerCommand("Expecto.stopWatchMode")(function () {
    stopWatchMode();
  });
  registerCommand("Expecto.watchMode")(function () {
    outputChannel.show();
  });
  statusBar.text = "$(eye) Watch Mode Off";
  statusBar.tooltip = "Expecto continuous testing";
  statusBar.command = "Expecto.watchMode";
  statusBar.show();

  var watcher = _vscode.workspace.createFileSystemWatcher("**/*.*");

  watcher.onDidChange(function (uri) {
    return onFileChanged(uri);
  });

  _vscode.window.onDidChangeActiveTextEditor(function () {
    setDecorations();
  });
}