"use strict";

exports.__esModule = true;
exports.fsiOutput = exports.fsiProcess = undefined;
exports.activate = activate;

var _vscode = require("vscode");

var _Utils = require("./../Core/Utils");

var _fableCore = require("fable-core");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _Environment = require("./Environment");

var _path = require("path");

var path_1 = _interopRequireWildcard(_path);

var _Project = require("./../Core/Project");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var fsiProcess = exports.fsiProcess = null;

var fsiOutput = exports.fsiOutput = _vscode.window.createOutputChannel("F# Interactive");

function handle(data) {
  if (_Utils.Utils.isNotNull(data)) {
    (function () {
      var response = _fableCore.String.replace(_fableCore.Util.toString(data), "\\", "\\\\");

      _fableCore.Seq.iterate(function (outChannel) {
        outChannel.append(response);
      }, function () {
        var $var21 = fsiOutput;

        if ($var21 != null) {
          return [$var21];
        } else {
          return [];
        }
      }());
    })();
  }
}

function start() {
  try {
    _fableCore.Seq.iterate(function (fp) {
      fp.kill();
    }, function () {
      var $var22 = fsiProcess;

      if ($var22 != null) {
        return [$var22];
      } else {
        return [];
      }
    }());

    exports.fsiProcess = fsiProcess = _Helpers.Process.onErrorOutput(function (data) {
      handle(data);
    }, _Helpers.Process.onOutput(function (data) {
      handle(data);
    }, _Helpers.Process.onExit(function (_arg1) {
      _fableCore.Seq.iterate(function (outChannel) {
        outChannel.clear();
      }, function () {
        var $var23 = fsiOutput;

        if ($var23 != null) {
          return [$var23];
        } else {
          return [];
        }
      }());
    }, _Helpers.Process.spawn(_Environment.fsi, "", "--fsi-server-input-codepage:65001"))));

    _fableCore.Seq.iterate(function (outChannel) {
      outChannel.show(2);
    }, function () {
      var $var24 = fsiOutput;

      if ($var24 != null) {
        return [$var24];
      } else {
        return [];
      }
    }());
  } catch (matchValue) {
    _vscode.window.showErrorMessage("Failed to spawn FSI, please ensure it's in PATH");
  }
}

function send(msg, file) {
  if (function () {
    return fsiProcess == null;
  }()) {
    start();
  }

  var msg_1 = msg + "\n;;\n";

  _fableCore.Seq.iterate(function (outChannel) {
    outChannel.append(msg_1);
  }, function () {
    var $var25 = fsiOutput;

    if ($var25 != null) {
      return [$var25];
    } else {
      return [];
    }
  }());

  var msg_ = function () {
    try {
      var dir = path_1.dirname(file);
      return "\n" + _fableCore.String.fsFormat("# silentCd @\"%s\" ;; ")(function (x) {
        return x;
      })(dir) + "\n" + _fableCore.String.fsFormat("# %d @\"%s\" ")(function (x) {
        return x;
      })(1)(file) + "\n" + msg_1;
    } catch (matchValue) {
      return msg_1;
    }
  }();

  _fableCore.Seq.iterate(function (fp) {
    fp.stdin.write(msg_, "utf-8");
  }, function () {
    var $var26 = fsiProcess;

    if ($var26 != null) {
      return [$var26];
    } else {
      return [];
    }
  }());
}

function sendLine() {
  var editor = _vscode.window.activeTextEditor;
  var file = editor.document.fileName;
  var pos = editor.selection.start;
  var line = editor.document.lineAt(pos);
  send(line.text, file);

  _vscode.commands.executeCommand("cursorDown");
}

function sendSelection() {
  var editor = _vscode.window.activeTextEditor;
  var file = editor.document.fileName;

  if (editor.selection.isEmpty) {
    sendLine();
  } else {
    var range = new _vscode.Range(editor.selection.anchor.line, editor.selection.anchor.character, editor.selection.active.line, editor.selection.active.character);
    var text = editor.document.getText(range);
    send(text, file);
  }
}

function sendFile() {
  var editor = _vscode.window.activeTextEditor;
  var file = editor.document.fileName;
  var text = editor.document.getText();
  send(text, file);
}

function referenceAssembly(path) {
  (function (m) {
    send(m);
  })(_fableCore.String.fsFormat("#r @\"%s\"")(function (x) {
    return x;
  })(path));
}

function sendReferences() {
  _fableCore.Seq.iterate(function (p) {
    (function (list) {
      _fableCore.Seq.iterate(function (path) {
        referenceAssembly(path);
      }, list);
    })(_fableCore.List.filter(function (n) {
      return !_fableCore.String.endsWith(n, "FSharp.Core.dll") ? !_fableCore.String.endsWith(n, "mscorlib.dll") : false;
    }, p.References));
  }, function () {
    var $var27 = (0, _Project.tryFindLoadedProjectByFile)(_vscode.window.activeTextEditor.document.fileName);

    if ($var27 != null) {
      return [$var27];
    } else {
      return [];
    }
  }());
}

function generateProjectReferences() {
  var ctn = function () {
    var $var28 = (0, _Project.tryFindLoadedProjectByFile)(_vscode.window.activeTextEditor.document.fileName);

    if ($var28 != null) {
      return function (p) {
        return Array.from(_fableCore.Seq.delay(function () {
          return _fableCore.Seq.append(_fableCore.List.map(_fableCore.String.fsFormat("#r @\"%s\"")(function (x) {
            return x;
          }), _fableCore.List.filter(function (n) {
            return !_fableCore.String.endsWith(n, "FSharp.Core.dll") ? !_fableCore.String.endsWith(n, "mscorlib.dll") : false;
          }, p.References)), _fableCore.Seq.delay(function () {
            return _fableCore.List.map(_fableCore.String.fsFormat("#load @\"%s\"")(function (x) {
              return x;
            }), p.Files);
          }));
        }));
      }($var28);
    } else {
      return $var28;
    }
  }();

  return function (builder_) {
    return ctn == null ? _Helpers.Promise.lift() : function () {
      var path = path_1.join(_vscode.workspace.rootPath, "references.fsx");
      return _Helpers.Promise.bind(function (_arg1) {
        return _Helpers.Promise.bind(function (_arg2) {
          return _Helpers.Promise.bind(function (_arg3) {
            return _Helpers.Promise.lift();
          }, _arg2.edit(function (e) {
            var p = new _vscode.Position(0, 0);

            var ctn_1 = _fableCore.String.join("\n", ctn);

            e.insert(p, ctn_1);
          }));
        }, _vscode.window.showTextDocument(_arg1, 3));
      }, _vscode.workspace.openTextDocument(_vscode.Uri.parse("untitled:" + path)));
    }();
  }(_Helpers.PromiseBuilderImp.promise);
}

function activate(disposables) {
  _vscode.commands.registerCommand("fsi.Start", function () {
    start();
  });

  _vscode.commands.registerCommand("fsi.SendLine", function () {
    sendLine();
  });

  _vscode.commands.registerCommand("fsi.SendSelection", function () {
    sendSelection();
  });

  _vscode.commands.registerCommand("fsi.SendFile", function () {
    sendFile();
  });

  _vscode.commands.registerCommand("fsi.SendProjectReferences", function () {
    sendReferences();
  });

  _vscode.commands.registerCommand("fsi.GenerateProjectReferences", function () {
    return generateProjectReferences();
  });
}