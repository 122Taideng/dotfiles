"use strict";

exports.__esModule = true;
exports.msbuild = exports.fsi = exports.isWin = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.spawnAndGetTrimmedOutput = spawnAndGetTrimmedOutput;
exports.tryGetTool = tryGetTool;

var _fs = require("fs");

var fs = _interopRequireWildcard(_fs);

var _fableCore = require("fable-core");

var _vscode = require("vscode");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _Utils = require("./../Core/Utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var isWin = exports.isWin = process.platform === "win32";

function op_LessDivideGreater(a, b) {
  return isWin ? a + "\\" + b : a + "/" + b;
}

function dirExists(dir) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch (matchValue) {
    return false;
  }
}

function fileExists(file) {
  try {
    return fs.statSync(file).isFile();
  } catch (matchValue) {
    return false;
  }
}

function getOrElse(defaultValue, option) {
  return option != null ? option : defaultValue;
}

var programFilesX86 = function () {
  var wow64 = process.env.PROCESSOR_ARCHITEW6432;
  var globalArch = process.env.PROCESSOR_ARCHITECTURE;
  return function (detected) {
    return detected == null ? "C:\\Program Files (x86)\\" : detected;
  }(function () {
    var matchValue = [wow64, globalArch];

    var $target0 = function $target0() {
      return process.env["ProgramFiles(x86)"];
    };

    var $target1 = function $target1() {
      return process.env.ProgramFiles;
    };

    if (matchValue[0] === "AMD64") {
      if (matchValue[1] === "AMD64") {
        return $target0();
      } else {
        return $target1();
      }
    } else {
      if (matchValue[0] === "x86") {
        if (matchValue[0] == null) {
          if (matchValue[1] === "AMD64") {
            return $target0();
          } else {
            return $target1();
          }
        } else {
          if (matchValue[1] === "AMD64") {
            return $target0();
          } else {
            return $target1();
          }
        }
      } else {
        if (matchValue[0] == null) {
          if (matchValue[1] === "AMD64") {
            return $target0();
          } else {
            return $target1();
          }
        } else {
          return $target1();
        }
      }
    }
  }());
}();

function getToolsPathWindows() {
  return function (list) {
    return _fableCore.Seq.tryFind(function (dir) {
      return dirExists(dir);
    }, list);
  }(_fableCore.List.map(function (v) {
    return op_LessDivideGreater(op_LessDivideGreater(op_LessDivideGreater(programFilesX86, "\\Microsoft SDKs\\F#\\"), v), "\\Framework\\v4.0");
  }, _fableCore.List.ofArray(["4.0", "3.1", "3.0"])));
}

function getToolsPathFromConfiguration() {
  var cfg = _vscode.workspace.getConfiguration();

  var path = cfg.get("FSharp.toolsDirPath", "");

  if (!(path === "") ? dirExists(path) : false) {
    return path;
  }
}

function getListDirectoriesToSearchForTools() {
  return _fableCore.List.choose(function (x) {
    return x;
  }, isWin ? _fableCore.List.ofArray([getToolsPathFromConfiguration(), getToolsPathWindows()]) : _fableCore.List.ofArray([getToolsPathFromConfiguration()]));
}

function findFirstValidFilePath(exeName, directoryList) {
  return function (list) {
    return _fableCore.Seq.tryFind(function (file) {
      return fileExists(file);
    }, list);
  }(_fableCore.List.map(function (v) {
    return op_LessDivideGreater(v, exeName);
  }, directoryList));
}

function getFsiFilePath() {
  return isWin ? function () {
    var cfg = _vscode.workspace.getConfiguration();

    var fsiPath = cfg.get("FSharp.fsiFilePath", "");

    if (fsiPath === "") {
      return "FsiAnyCpu.exe";
    } else {
      return fsiPath;
    }
  }() : "fsharpi";
}

var fsi = exports.fsi = function () {
  var fileName = getFsiFilePath();
  var dirs = getListDirectoriesToSearchForTools();
  var matchValue = findFirstValidFilePath(fileName, dirs);

  if (matchValue != null) {
    return matchValue;
  } else {
    return fileName;
  }
}();

function spawnAndGetTrimmedOutput(location, linuxCmd, command) {
  return _Helpers.Promise.map(function (tupledArg) {
    return [tupledArg[0], _Utils.String.trim(_fableCore.Util.toString(tupledArg[1])), _Utils.String.trim(_fableCore.Util.toString(tupledArg[2]))];
  }, _Helpers.Process.exec(location, linuxCmd, command));
}

function tryGetTool(toolName) {
  return _Helpers.Promise.map(function (tupledArg) {
    return tupledArg[1] !== "" ? tupledArg[1] : null;
  }, spawnAndGetTrimmedOutput("which", "", toolName));
}

var msbuild = exports.msbuild = function () {
  var configured = _Utils.Configuration.get("", "FSharp.msbuildLocation");

  if (configured !== "") {
    return _Helpers.Promise.lift(configured);
  } else {
    if (!isWin) {
      var _ret = function () {
        var tools = _fableCore.List.ofArray(["msbuild", "xbuild"]);

        return {
          v: function (builder_) {
            return _Helpers.Promise.bind(function (_arg1) {
              var $target1 = function $target1() {
                throw ["D:\\Programowanie\\Projekty\\Ionide\\VSCode\\ionide-vscode-fsharp\\src\\Components/Environment.fs", 109, 25];
              };

              if (_arg1.tail != null) {
                if (_arg1.tail.tail != null) {
                  if (_arg1.tail.tail.tail == null) {
                    var msbuild_1 = _arg1.head;
                    var xbuild = _arg1.tail.head;
                    {
                      var matchValue = [msbuild_1, xbuild];

                      if (matchValue[0] != null) {
                        var m = matchValue[0];
                        return _Helpers.Promise.lift(m);
                      } else {
                        if (matchValue[1] != null) {
                          var x = matchValue[1];
                          return _Helpers.Promise.lift(x);
                        } else {
                          return _Helpers.Promise.lift("xbuild");
                        }
                      }
                    }
                  } else {
                    return $target1();
                  }
                } else {
                  return $target1();
                }
              } else {
                return $target1();
              }
            }, _Helpers.Promise.map(function (source) {
              return _fableCore.Seq.toList(source);
            }, _Helpers.Promise.all(function (list) {
              return _fableCore.List.map(function (toolName) {
                return tryGetTool(toolName);
              }, list);
            }(tools))));
          }(_Helpers.PromiseBuilderImp.promise)
        };
      }();

      if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    } else {
      var MSBuildPath = _fableCore.List.ofArray([op_LessDivideGreater(programFilesX86, "\\MSBuild\\14.0\\Bin"), op_LessDivideGreater(programFilesX86, "\\MSBuild\\12.0\\Bin"), op_LessDivideGreater(programFilesX86, "\\MSBuild\\12.0\\Bin\\amd64"), "c:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\", "c:\\Windows\\Microsoft.NET\\Framework\\v4.0.30128\\", "c:\\Windows\\Microsoft.NET\\Framework\\v3.5\\"]);

      return _Helpers.Promise.lift(findFirstValidFilePath("MSBuild.exe", MSBuildPath) != null ? findFirstValidFilePath("MSBuild.exe", MSBuildPath) : "msbuild.exe");
    }
  }
}();