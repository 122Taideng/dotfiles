"use strict";

exports.__esModule = true;
exports.outputChannel = exports.TemplateFile = exports.Template = undefined;
exports.op_LessDivideGreater = op_LessDivideGreater;
exports.onFsFileCreateHandler = onFsFileCreateHandler;
exports.onFsFileRemovedHandler = onFsFileRemovedHandler;
exports.moveFileUp = moveFileUp;
exports.moveFileDown = moveFileDown;
exports.refreshTemplates = refreshTemplates;
exports.addCurrentFileToProject = addCurrentFileToProject;
exports.removeCurrentFileFromProject = removeCurrentFileFromProject;
exports.addReference = addReference;
exports.removeReference = removeReference;
exports.addProjectReference = addProjectReference;
exports.removeProjectReference = removeProjectReference;
exports.newProject = newProject;
exports.newProjectNoFake = newProjectNoFake;
exports.newProjectScaffold = newProjectScaffold;
exports.activate = activate;

var _fableCore = require("fable-core");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _vscode = require("vscode");

var _Utils = require("./../Core/Utils");

var _Project = require("./../Core/Project");

var _fs = require("fs");

var fs = _interopRequireWildcard(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Template = exports.Template = function () {
  function Template(name, value) {
    _classCallCheck(this, Template);

    this.name = name;
    this.value = value;
  }

  Template.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Template.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Template;
}();

_fableCore.Util.setInterfaces(Template.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.Forge.Template");

var TemplateFile = exports.TemplateFile = function () {
  function TemplateFile(templates) {
    _classCallCheck(this, TemplateFile);

    this.Templates = templates;
  }

  TemplateFile.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  TemplateFile.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return TemplateFile;
}();

_fableCore.Util.setInterfaces(TemplateFile.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.Forge.TemplateFile");

function op_LessDivideGreater(a, b) {
  return _Helpers.Process.isWin() ? a + "\\" + b : a + "/" + b;
}

var location = function () {
  try {
    return op_LessDivideGreater(op_LessDivideGreater(_Helpers.VSCode.getPluginPath("Ionide.ionide-fsharp"), "bin_forge"), "Forge.exe");
  } catch (matchValue) {
    return op_LessDivideGreater(op_LessDivideGreater(_Helpers.VSCode.getPluginPath("Ionide.Ionide-fsharp"), "bin_forge"), "Forge.exe");
  }
}();

var templateLocation = function () {
  try {
    return op_LessDivideGreater(op_LessDivideGreater(_Helpers.VSCode.getPluginPath("Ionide.ionide-fsharp"), "templates"), "templates.json");
  } catch (matchValue) {
    return op_LessDivideGreater(op_LessDivideGreater(_Helpers.VSCode.getPluginPath("Ionide.Ionide-fsharp"), "templates"), "templates.json");
  }
}();

var outputChannel = exports.outputChannel = _vscode.window.createOutputChannel("Forge");

function spawnForge(cmd) {
  var cmd_1 = _fableCore.String.replace(_fableCore.String.replace(cmd, "\r", ""), "\n", "");

  var cmd_2 = cmd_1 + " --no-prompt";
  outputChannel.clear();
  outputChannel.append("forge " + cmd_2 + "\n");
  return _Helpers.Process.spawnWithNotification(location, "mono", cmd_2, outputChannel);
}

function execForge(cmd) {
  return _Helpers.Process.exec(location, "mono", cmd + " --no-prompt");
}

function handleForgeList(error, stdout, stderr) {
  return Array.from(stdout.toString() === "" ? [] : stdout.toString().split("\n").filter(function () {
    var x = "";
    return function (y) {
      return x !== y;
    };
  }()));
}

function quotePath(path) {
  return path != undefined ? path.indexOf(" ") >= 0 ? "\"" + path + "\"" : path : path;
}

function onFsFileCreateHandler(uri) {
  if (_Utils.Configuration.get(false, "FSharp.automaticProjectModification")) {
    spawnForge(_fableCore.String.fsFormat("add file -n %s")(function (x) {
      return x;
    })(uri.fsPath));
  }
}

function onFsFileRemovedHandler(uri) {
  if (_Utils.Configuration.get(false, "FSharp.automaticProjectModification")) {
    spawnForge(_fableCore.String.fsFormat("remove file -n %s")(function (x) {
      return x;
    })(uri.fsPath));
  }
}

function moveFileUp() {
  var editor = _vscode.window.activeTextEditor;
  var matchValue = editor.document;

  var activePatternResult2513 = _Utils.Document.$FSharp$CSharp$VB$Other$(matchValue);

  if (activePatternResult2513.Case === "Choice1Of4") {
    spawnForge(_fableCore.String.fsFormat("move file -n %s -u")(function (x) {
      return x;
    })(editor.document.fileName));
  }
}

function moveFileDown() {
  var editor = _vscode.window.activeTextEditor;
  var matchValue = editor.document;

  var activePatternResult2515 = _Utils.Document.$FSharp$CSharp$VB$Other$(matchValue);

  if (activePatternResult2515.Case === "Choice1Of4") {
    spawnForge(_fableCore.String.fsFormat("move file -n %s -d")(function (x) {
      return x;
    })(editor.document.fileName));
  }
}

function refreshTemplates() {
  spawnForge("refresh");
}

function addCurrentFileToProject() {
  var editor = _vscode.window.activeTextEditor;
  var matchValue = editor.document;

  var activePatternResult2518 = _Utils.Document.$FSharp$CSharp$VB$Other$(matchValue);

  if (activePatternResult2518.Case === "Choice1Of4") {
    spawnForge(_fableCore.String.fsFormat("add file -n %s")(function (x) {
      return x;
    })(editor.document.fileName));
  }
}

function removeCurrentFileFromProject() {
  var editor = _vscode.window.activeTextEditor;
  var matchValue = editor.document;

  var activePatternResult2520 = _Utils.Document.$FSharp$CSharp$VB$Other$(matchValue);

  if (activePatternResult2520.Case === "Choice1Of4") {
    spawnForge(_fableCore.String.fsFormat("remove file -n %s")(function (x) {
      return x;
    })(editor.document.fileName));
  }
}

function addReference() {
  return function (builder_) {
    var projects = Array.from((0, _Project.getAll)());

    if (projects.length !== 0) {
      var opts = {};
      opts.placeHolder = "Project to edit";
      return _Helpers.Promise.bind(function (_arg1) {
        var opts_1 = {};
        opts_1.placeHolder = "Reference";
        return _Helpers.Promise.bind(function (_arg2) {
          return (_arg2 != undefined ? _arg1 != undefined : false) ? function () {
            spawnForge(_fableCore.String.fsFormat("add reference -n %s -p %s")(function (x) {
              return x;
            })(_arg2)(_arg1));
            return Promise.resolve();
          }() : Promise.resolve();
        }, function (pr) {
          return _Helpers.Promise.map(function (path) {
            return quotePath(path);
          }, pr);
        }(_vscode.window.showInputBox(opts_1)));
      }, function (pr) {
        return _Helpers.Promise.map(function (path) {
          return quotePath(path);
        }, pr);
      }(_vscode.window.showQuickPick(projects, opts)));
    } else {
      return Promise.resolve();
    }
  }(_Helpers.PromiseBuilderImp.promise);
}

function removeReference() {
  return function (builder_) {
    var projects = Array.from((0, _Project.getAll)());

    if (projects.length !== 0) {
      var opts = {};
      opts.placeHolder = "Project to edit";
      return _Helpers.Promise.bind(function (_arg1) {
        return _Helpers.Promise.bind(function (_arg2) {
          return _arg2.length !== 0 ? function () {
            var opts_1 = {};
            opts_1.placeHolder = "Reference";
            return _Helpers.Promise.bind(function (_arg3) {
              return (_arg3 != undefined ? _arg1 != undefined : false) ? function () {
                spawnForge(_fableCore.String.fsFormat("remove reference -n %s -p %s")(function (x) {
                  return x;
                })(_arg3)(_arg1));
                return Promise.resolve();
              }() : Promise.resolve();
            }, function (pr) {
              return _Helpers.Promise.map(function (path) {
                return quotePath(path);
              }, pr);
            }(_vscode.window.showQuickPick(_arg2, opts_1)));
          }() : Promise.resolve();
        }, _Helpers.Promise.map(function (tupledArg) {
          return handleForgeList(tupledArg[0], tupledArg[1], tupledArg[2]);
        }, execForge(_fableCore.String.fsFormat("list references -p %s")(function (x) {
          return x;
        })(_arg1))));
      }, function (pr) {
        return _Helpers.Promise.map(function (path) {
          return quotePath(path);
        }, pr);
      }(_vscode.window.showQuickPick(projects, opts)));
    } else {
      return Promise.resolve();
    }
  }(_Helpers.PromiseBuilderImp.promise);
}

function addProjectReference() {
  return function (builder_) {
    var projects = Array.from((0, _Project.getAll)());

    if (projects.length !== 0) {
      var opts = {};
      opts.placeHolder = "Project to edit";
      return _Helpers.Promise.bind(function (_arg1) {
        var opts_1 = {};
        opts_1.placeHolder = "Reference";
        return _Helpers.Promise.bind(function (_arg2) {
          return (_arg2 != undefined ? _arg1 != undefined : false) ? function () {
            spawnForge(_fableCore.String.fsFormat("add project -n %s -p %s")(function (x) {
              return x;
            })(_arg2)(_arg1));
            return Promise.resolve();
          }() : Promise.resolve();
        }, function (pr) {
          return _Helpers.Promise.map(function (path) {
            return quotePath(path);
          }, pr);
        }(_vscode.window.showQuickPick(projects, opts_1)));
      }, function (pr) {
        return _Helpers.Promise.map(function (path) {
          return quotePath(path);
        }, pr);
      }(_vscode.window.showQuickPick(projects, opts)));
    } else {
      return Promise.resolve();
    }
  }(_Helpers.PromiseBuilderImp.promise);
}

function removeProjectReference() {
  return function (builder_) {
    var projects = Array.from((0, _Project.getAll)());

    if (projects.length !== 0) {
      var opts = {};
      opts.placeHolder = "Project to edit";
      return _Helpers.Promise.bind(function (_arg1) {
        return _Helpers.Promise.bind(function (_arg2) {
          return _arg2.length !== 0 ? function () {
            var opts_1 = {};
            opts_1.placeHolder = "Reference";
            return _Helpers.Promise.bind(function (_arg3) {
              return (_arg3 != undefined ? _arg1 != undefined : false) ? function () {
                spawnForge(_fableCore.String.fsFormat("remove project -n %s -p %s")(function (x) {
                  return x;
                })(_arg3)(_arg1));
                return Promise.resolve();
              }() : Promise.resolve();
            }, function (pr) {
              return _Helpers.Promise.map(function (path) {
                return quotePath(path);
              }, pr);
            }(_vscode.window.showQuickPick(_arg2, opts_1)));
          }() : Promise.resolve();
        }, _Helpers.Promise.map(function (tupledArg) {
          return handleForgeList(tupledArg[0], tupledArg[1], tupledArg[2]);
        }, execForge(_fableCore.String.fsFormat("list projectReferences -p %s")(function (x) {
          return x;
        })(_arg1))));
      }, function (pr) {
        return _Helpers.Promise.map(function (path) {
          return quotePath(path);
        }, pr);
      }(_vscode.window.showQuickPick(projects, opts)));
    } else {
      return Promise.resolve();
    }
  }(_Helpers.PromiseBuilderImp.promise);
}

function newProject() {
  return function (builder_) {
    return fs.existsSync(templateLocation) ? function () {
      var f = _fableCore.Util.toString(fs.readFileSync(templateLocation));

      var file = function (arg00) {
        return JSON.parse(arg00);
      }(f);

      var n = Array.from(file.Templates.map(function (t) {
        var res = {};
        res.label = t.value;
        res.description = t.name;
        return res;
      }));

      if (n.length !== 0) {
        var cwd = _vscode.workspace.rootPath;

        if (cwd != undefined) {
          return _Helpers.Promise.bind(function (_arg1) {
            return _arg1 != undefined ? function () {
              var opts = {};
              opts.prompt = "Project directory";
              return _Helpers.Promise.bind(function (_arg2) {
                var opts_1 = {};
                opts_1.prompt = "Project name";
                return _Helpers.Promise.bind(function (_arg3) {
                  return (_arg2 != undefined ? _arg3 != undefined : false) ? _arg3 !== "" ? function () {
                    spawnForge(_fableCore.String.fsFormat("new project -n %s -t %s --folder %s")(function (x) {
                      return x;
                    })(_arg3)(_arg1.label)(_arg2));

                    _vscode.window.showInformationMessage("Project created");

                    return Promise.resolve();
                  }() : function () {
                    _vscode.window.showErrorMessage("Invalid project name.");

                    return Promise.resolve();
                  }() : Promise.resolve();
                }, _vscode.window.showInputBox(opts_1));
              }, _vscode.window.showInputBox(opts));
            }() : Promise.resolve();
          }, _vscode.window.showQuickPick(n));
        } else {
          _vscode.window.showErrorMessage("No open folder.");

          return Promise.resolve();
        }
      } else {
        _vscode.window.showInformationMessage("No templates found. Run `F#: Refresh Project Templates` command");

        return Promise.resolve();
      }
    }() : function () {
      _vscode.window.showInformationMessage("No templates found. Run `F#: Refresh Project Templates` command");

      return Promise.resolve();
    }();
  }(_Helpers.PromiseBuilderImp.promise);
}

function newProjectNoFake() {
  return function (builder_) {
    return fs.existsSync(templateLocation) ? function () {
      var f = _fableCore.Util.toString(fs.readFileSync(templateLocation));

      var file = function (arg00) {
        return JSON.parse(arg00);
      }(f);

      var n = Array.from(file.Templates.map(function (t) {
        var res = {};
        res.label = t.value;
        res.description = t.name;
        return res;
      }));

      if (n.length !== 0) {
        return _Helpers.Promise.bind(function (_arg1) {
          return _arg1 != undefined ? function () {
            var opts = {};
            opts.prompt = "Project directory";
            return _Helpers.Promise.bind(function (_arg2) {
              var opts_1 = {};
              opts_1.prompt = "Project name";
              return _Helpers.Promise.bind(function (_arg3) {
                return (_arg2 != undefined ? _arg3 != undefined : false) ? function () {
                  spawnForge(_fableCore.String.fsFormat("new project -n %s -t %s --folder %s --no-fake")(function (x) {
                    return x;
                  })(_arg3)(_arg1.label)(_arg2));

                  _vscode.window.showInformationMessage("Project created");

                  return Promise.resolve();
                }() : Promise.resolve();
              }, _vscode.window.showInputBox(opts_1));
            }, _vscode.window.showInputBox(opts));
          }() : Promise.resolve();
        }, _vscode.window.showQuickPick(n));
      } else {
        _vscode.window.showInformationMessage("No templates found. Run `F#: Refresh Project Templates` command");

        return Promise.resolve();
      }
    }() : function () {
      _vscode.window.showInformationMessage("No templates found. Run `F#: Refresh Project Templates` command");

      return Promise.resolve();
    }();
  }(_Helpers.PromiseBuilderImp.promise);
}

function newProjectScaffold() {
  return function (builder_) {
    spawnForge(_fableCore.String.fsFormat("new scaffold")(function (x) {
      return x;
    }));

    _vscode.window.showInformationMessage("Project created");

    return Promise.resolve();
  }(_Helpers.PromiseBuilderImp.promise);
}

function activate(disposables) {
  var watcher = _vscode.workspace.createFileSystemWatcher("**/*.fs");

  watcher.onDidCreate(function (uri) {
    onFsFileCreateHandler(uri);
  }, null, disposables);
  watcher.onDidDelete(function (uri) {
    onFsFileRemovedHandler(uri);
  }, null, disposables);

  _vscode.commands.registerCommand("fsharp.MoveFileUp", function () {
    moveFileUp();
  });

  _vscode.commands.registerCommand("fsharp.MoveFileDown", function () {
    moveFileDown();
  });

  _vscode.commands.registerCommand("fsharp.NewProject", function () {
    return newProject();
  });

  _vscode.commands.registerCommand("fsharp.NewProjectNoFake", function () {
    return newProjectNoFake();
  });

  _vscode.commands.registerCommand("fsharp.NewProjectScaffold", function () {
    return newProjectScaffold();
  });

  _vscode.commands.registerCommand("fsharp.RefreshProjectTemplates", function () {
    refreshTemplates();
  });

  _vscode.commands.registerTextEditorCommand("fsharp.AddFileToProject", function () {
    addCurrentFileToProject();
  });

  _vscode.commands.registerTextEditorCommand("fsharp.RemoveFileFromProject", function () {
    removeCurrentFileFromProject();
  });

  _vscode.commands.registerCommand("fsharp.AddProjectReference", function () {
    return addProjectReference();
  });

  _vscode.commands.registerCommand("fsharp.RemoveProjectReference", function () {
    return removeProjectReference();
  });

  _vscode.commands.registerCommand("fsharp.AddReference", function () {
    return addReference();
  });

  _vscode.commands.registerCommand("fsharp.RemoveReference", function () {
    return removeReference();
  });

  if (!fs.existsSync(templateLocation)) {
    refreshTemplates();
  }
}