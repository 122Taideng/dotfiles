"use strict";

exports.__esModule = true;
exports.activate = undefined;
exports.find = find;
exports.findAll = findAll;
exports.getAll = getAll;
exports.load = load;
exports.tryFindLoadedProject = tryFindLoadedProject;
exports.tryFindLoadedProjectByFile = tryFindLoadedProjectByFile;
exports.getLoaded = getLoaded;

var _fableCore = require("fable-core");

var _fs = require("fs");

var fs = _interopRequireWildcard(_fs);

var _path = require("path");

var path_1 = _interopRequireWildcard(_path);

var _vscode = require("vscode");

var _Helpers = require("./../fable_external/Helpers-729269674");

var _Utils = require("./Utils");

var _LanguageService = require("./LanguageService");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var emptyProjectsMap = _fableCore.Map.create(new _fableCore.List(), new _fableCore.GenericComparer(function (x, y) {
  return x < y ? -1 : x > y ? 1 : 0;
}));

var loadedProjects = emptyProjectsMap;

function find(p) {
  var findFsProj = function findFsProj(dir) {
    return fs.lstatSync(dir).isDirectory() ? function () {
      var files = fs.readdirSync(dir);

      var projfile = _fableCore.Seq.tryFind(function (s) {
        return _fableCore.String.endsWith(s, ".fsproj");
      }, files);

      if (projfile != null) {
        return dir + path_1.sep + projfile;
      } else {
        var projfile_1 = _fableCore.Seq.tryFind(function (s) {
          return _fableCore.String.endsWith(s, "project.json");
        }, files);

        if (projfile_1 != null) {
          return dir + path_1.sep + projfile_1;
        } else {
          var parent = dir.lastIndexOf(path_1.sep) > 0 ? dir.substr(0, dir.lastIndexOf(path_1.sep)) : "";

          if (_fableCore.String.isNullOrEmpty(parent)) {
            return null;
          } else {
            return findFsProj(parent);
          }
        }
      }
    }() : null;
  };

  return findFsProj(function (arg00) {
    return path_1.dirname(arg00);
  }(p));
}

function findAll() {
  var findProjs = function findProjs(dir) {
    var files = fs.readdirSync(dir);
    return _fableCore.List.collect(function (s_) {
      try {
        var s = dir + path_1.sep + s_;

        if (s_ === ".git" ? true : s_ === "paket-files") {
          return new _fableCore.List();
        } else {
          if (fs.statSync(s).isDirectory()) {
            return findProjs(s);
          } else {
            if (_fableCore.String.endsWith(s, ".fsproj")) {
              return _fableCore.List.ofArray([s]);
            } else {
              return new _fableCore.List();
            }
          }
        }
      } catch (matchValue) {
        return new _fableCore.List();
      }
    }, _fableCore.Seq.toList(files));
  };

  var matchValue = _vscode.workspace.rootPath;

  if (matchValue == null) {
    return new _fableCore.List();
  } else {
    return findProjs(matchValue);
  }
}

function getAll() {
  var findProjs = function findProjs(dir) {
    var files = fs.readdirSync(dir);
    return _fableCore.List.collect(function (s_) {
      try {
        var s = dir + path_1.sep + s_;

        if (s_ === ".git" ? true : s_ === "paket-files") {
          return new _fableCore.List();
        } else {
          if (fs.statSync(s).isDirectory()) {
            return findProjs(s);
          } else {
            if ((_fableCore.String.endsWith(s, ".fsproj") ? true : _fableCore.String.endsWith(s, ".csproj")) ? true : _fableCore.String.endsWith(s, ".vbproj")) {
              return _fableCore.List.ofArray([s]);
            } else {
              return new _fableCore.List();
            }
          }
        }
      } catch (matchValue) {
        return new _fableCore.List();
      }
    }, _fableCore.Seq.toList(files));
  };

  var matchValue = _vscode.workspace.rootPath;

  if (matchValue == null) {
    return new _fableCore.List();
  } else {
    return findProjs(matchValue);
  }
}

function clearLoadedProjects() {
  loadedProjects = emptyProjectsMap;
}

function load(path) {
  return _Helpers.Promise.onSuccess(function (pr) {
    if (_Utils.Utils.isNotNull(pr)) {
      loadedProjects = function (tupledArg) {
        return _fableCore.Map.add(tupledArg[0], tupledArg[1], loadedProjects);
      }([pr.Data.Project.toUpperCase(), pr.Data]);
    }
  }, (0, _LanguageService.project)(path));
}

function tryFindLoadedProject(path) {
  return _fableCore.Map.tryFind(path.toUpperCase(), loadedProjects);
}

function tryFindLoadedProjectByFile(filePath) {
  return _fableCore.Seq.tryHead(_fableCore.Seq.choose(function (kvp) {
    var len = _fableCore.List.filter(function (f) {
      return f.toUpperCase() === filePath.toUpperCase();
    }, kvp[1].Files).length;

    if (len > 0) {
      return kvp[1];
    }
  }, loadedProjects));
}

function getLoaded() {
  return _fableCore.Seq.map(function (kv) {
    return kv[1];
  }, loadedProjects);
}

var activate = exports.activate = function activate($var10) {
  return function (items) {
    return _Utils.Promise.executeForAll(function (path) {
      return load(path);
    }, items);
  }(function ($var9) {
    return findAll(clearLoadedProjects($var9));
  }($var10));
};