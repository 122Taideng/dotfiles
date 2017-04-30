"use strict";

exports.__esModule = true;
exports.Result = exports.UnionCaseGenerator = exports.ResolveNamespace = exports.QualifySymbol = exports.OpenNamespace = exports.Project = exports.Lint = exports.Fix = exports.Symbols = exports.Symbol = exports.Pos = exports.Range = exports.CompilerLocation = exports.Method = exports.Overload = exports.OverloadParameter = exports.Helptext = exports.SymbolUses = exports.SymbolUse = exports.Completion = exports.Declaration = exports.ErrorResp = exports.Error = exports.OverloadSignature = exports.CompletionRequest = exports.PositionRequest = exports.HelptextRequest = exports.DeclarationsRequest = exports.ProjectRequest = exports.ParseRequest = undefined;

var _fableCore = require("fable-core");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParseRequest = exports.ParseRequest = function () {
  function ParseRequest(fileName, isAsync, lines, version) {
    _classCallCheck(this, ParseRequest);

    this.FileName = fileName;
    this.IsAsync = isAsync;
    this.Lines = lines;
    this.Version = version;
  }

  ParseRequest.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  ParseRequest.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return ParseRequest;
}();

_fableCore.Util.setInterfaces(ParseRequest.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.ParseRequest");

var ProjectRequest = exports.ProjectRequest = function () {
  function ProjectRequest(fileName) {
    _classCallCheck(this, ProjectRequest);

    this.FileName = fileName;
  }

  ProjectRequest.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  ProjectRequest.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return ProjectRequest;
}();

_fableCore.Util.setInterfaces(ProjectRequest.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.ProjectRequest");

var DeclarationsRequest = exports.DeclarationsRequest = function () {
  function DeclarationsRequest(fileName, version) {
    _classCallCheck(this, DeclarationsRequest);

    this.FileName = fileName;
    this.Version = version;
  }

  DeclarationsRequest.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  DeclarationsRequest.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return DeclarationsRequest;
}();

_fableCore.Util.setInterfaces(DeclarationsRequest.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.DeclarationsRequest");

var HelptextRequest = exports.HelptextRequest = function () {
  function HelptextRequest(symbol) {
    _classCallCheck(this, HelptextRequest);

    this.Symbol = symbol;
  }

  HelptextRequest.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  HelptextRequest.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return HelptextRequest;
}();

_fableCore.Util.setInterfaces(HelptextRequest.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.HelptextRequest");

var PositionRequest = exports.PositionRequest = function () {
  function PositionRequest(fileName, line, column, filter) {
    _classCallCheck(this, PositionRequest);

    this.FileName = fileName;
    this.Line = line;
    this.Column = column;
    this.Filter = filter;
  }

  PositionRequest.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  PositionRequest.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return PositionRequest;
}();

_fableCore.Util.setInterfaces(PositionRequest.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.PositionRequest");

var CompletionRequest = exports.CompletionRequest = function () {
  function CompletionRequest(fileName, sourceLine, line, column, filter, includeKeywords) {
    _classCallCheck(this, CompletionRequest);

    this.FileName = fileName;
    this.SourceLine = sourceLine;
    this.Line = line;
    this.Column = column;
    this.Filter = filter;
    this.IncludeKeywords = includeKeywords;
  }

  CompletionRequest.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  CompletionRequest.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return CompletionRequest;
}();

_fableCore.Util.setInterfaces(CompletionRequest.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.CompletionRequest");

var OverloadSignature = exports.OverloadSignature = function () {
  function OverloadSignature(signature, comment) {
    _classCallCheck(this, OverloadSignature);

    this.Signature = signature;
    this.Comment = comment;
  }

  OverloadSignature.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  OverloadSignature.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return OverloadSignature;
}();

_fableCore.Util.setInterfaces(OverloadSignature.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.OverloadSignature");

var Error = exports.Error = function () {
  function Error(startLine, startColumn, endLine, endColumn, message, severity, subcategory, fileName) {
    _classCallCheck(this, Error);

    this.StartLine = startLine;
    this.StartColumn = startColumn;
    this.EndLine = endLine;
    this.EndColumn = endColumn;
    this.Message = message;
    this.Severity = severity;
    this.Subcategory = subcategory;
    this.FileName = fileName;
  }

  Error.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Error.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Error;
}();

_fableCore.Util.setInterfaces(Error.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Error");

var ErrorResp = exports.ErrorResp = function () {
  function ErrorResp(file, errors) {
    _classCallCheck(this, ErrorResp);

    this.File = file;
    this.Errors = errors;
  }

  ErrorResp.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  ErrorResp.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return ErrorResp;
}();

_fableCore.Util.setInterfaces(ErrorResp.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.ErrorResp");

var Declaration = exports.Declaration = function () {
  function Declaration(file, line, column) {
    _classCallCheck(this, Declaration);

    this.File = file;
    this.Line = line;
    this.Column = column;
  }

  Declaration.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Declaration.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Declaration;
}();

_fableCore.Util.setInterfaces(Declaration.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Declaration");

var Completion = exports.Completion = function () {
  function Completion(name, replacementText, glyph, glyphChar) {
    _classCallCheck(this, Completion);

    this.Name = name;
    this.ReplacementText = replacementText;
    this.Glyph = glyph;
    this.GlyphChar = glyphChar;
  }

  Completion.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Completion.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Completion;
}();

_fableCore.Util.setInterfaces(Completion.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Completion");

var SymbolUse = exports.SymbolUse = function () {
  function SymbolUse(fileName, startLine, startColumn, endLine, endColumn, isFromDefinition, isFromAttribute, isFromComputationExpression, isFromDispatchSlotImplementation, isFromPattern, isFromType) {
    _classCallCheck(this, SymbolUse);

    this.FileName = fileName;
    this.StartLine = startLine;
    this.StartColumn = startColumn;
    this.EndLine = endLine;
    this.EndColumn = endColumn;
    this.IsFromDefinition = isFromDefinition;
    this.IsFromAttribute = isFromAttribute;
    this.IsFromComputationExpression = isFromComputationExpression;
    this.IsFromDispatchSlotImplementation = isFromDispatchSlotImplementation;
    this.IsFromPattern = isFromPattern;
    this.IsFromType = isFromType;
  }

  SymbolUse.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  SymbolUse.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return SymbolUse;
}();

_fableCore.Util.setInterfaces(SymbolUse.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.SymbolUse");

var SymbolUses = exports.SymbolUses = function () {
  function SymbolUses(name, uses) {
    _classCallCheck(this, SymbolUses);

    this.Name = name;
    this.Uses = uses;
  }

  SymbolUses.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  SymbolUses.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return SymbolUses;
}();

_fableCore.Util.setInterfaces(SymbolUses.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.SymbolUses");

var Helptext = exports.Helptext = function () {
  function Helptext(name, overloads) {
    _classCallCheck(this, Helptext);

    this.Name = name;
    this.Overloads = overloads;
  }

  Helptext.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Helptext.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Helptext;
}();

_fableCore.Util.setInterfaces(Helptext.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Helptext");

var OverloadParameter = exports.OverloadParameter = function () {
  function OverloadParameter(name, canonicalTypeTextForSorting, display, description) {
    _classCallCheck(this, OverloadParameter);

    this.Name = name;
    this.CanonicalTypeTextForSorting = canonicalTypeTextForSorting;
    this.Display = display;
    this.Description = description;
  }

  OverloadParameter.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  OverloadParameter.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return OverloadParameter;
}();

_fableCore.Util.setInterfaces(OverloadParameter.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.OverloadParameter");

var Overload = exports.Overload = function () {
  function Overload(tip, typeText, parameters, isStaticArguments) {
    _classCallCheck(this, Overload);

    this.Tip = tip;
    this.TypeText = typeText;
    this.Parameters = parameters;
    this.IsStaticArguments = isStaticArguments;
  }

  Overload.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Overload.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Overload;
}();

_fableCore.Util.setInterfaces(Overload.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Overload");

var Method = exports.Method = function () {
  function Method(name, currentParameter, overloads) {
    _classCallCheck(this, Method);

    this.Name = name;
    this.CurrentParameter = currentParameter;
    this.Overloads = overloads;
  }

  Method.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Method.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Method;
}();

_fableCore.Util.setInterfaces(Method.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Method");

var CompilerLocation = exports.CompilerLocation = function () {
  function CompilerLocation(fcs, fsi, mSBuild) {
    _classCallCheck(this, CompilerLocation);

    this.Fcs = fcs;
    this.Fsi = fsi;
    this.MSBuild = mSBuild;
  }

  CompilerLocation.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  CompilerLocation.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return CompilerLocation;
}();

_fableCore.Util.setInterfaces(CompilerLocation.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.CompilerLocation");

var _Range = function () {
  function _Range(startColumn, startLine, endColumn, endLine) {
    _classCallCheck(this, _Range);

    this.StartColumn = startColumn;
    this.StartLine = startLine;
    this.EndColumn = endColumn;
    this.EndLine = endLine;
  }

  _Range.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  _Range.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return _Range;
}();

exports.Range = _Range;

_fableCore.Util.setInterfaces(_Range.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Range");

var Pos = exports.Pos = function () {
  function Pos(line, col) {
    _classCallCheck(this, Pos);

    this.Line = line;
    this.Col = col;
  }

  Pos.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Pos.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Pos;
}();

_fableCore.Util.setInterfaces(Pos.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Pos");

var _Symbol = function () {
  function _Symbol(uniqueName, name, glyph, glyphChar, isTopLevel, range, bodyRange, file, enclosingEntity, isAbstract) {
    _classCallCheck(this, _Symbol);

    this.UniqueName = uniqueName;
    this.Name = name;
    this.Glyph = glyph;
    this.GlyphChar = glyphChar;
    this.IsTopLevel = isTopLevel;
    this.Range = range;
    this.BodyRange = bodyRange;
    this.File = file;
    this.EnclosingEntity = enclosingEntity;
    this.IsAbstract = isAbstract;
  }

  _Symbol.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  _Symbol.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return _Symbol;
}();

exports.Symbol = _Symbol;

_fableCore.Util.setInterfaces(_Symbol.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Symbol");

var Symbols = exports.Symbols = function () {
  function Symbols(declaration, nested) {
    _classCallCheck(this, Symbols);

    this.Declaration = declaration;
    this.Nested = nested;
  }

  Symbols.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Symbols.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Symbols;
}();

_fableCore.Util.setInterfaces(Symbols.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Symbols");

var Fix = exports.Fix = function () {
  function Fix(fromRange, fromText, toText) {
    _classCallCheck(this, Fix);

    this.FromRange = fromRange;
    this.FromText = fromText;
    this.ToText = toText;
  }

  Fix.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Fix.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Fix;
}();

_fableCore.Util.setInterfaces(Fix.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Fix");

var Lint = exports.Lint = function () {
  function Lint(info, input, range, fix) {
    _classCallCheck(this, Lint);

    this.Info = info;
    this.Input = input;
    this.Range = range;
    this.Fix = fix;
  }

  Lint.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Lint.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Lint;
}();

_fableCore.Util.setInterfaces(Lint.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Lint");

var Project = exports.Project = function () {
  function Project(project, files, output, references, logs) {
    _classCallCheck(this, Project);

    this.Project = project;
    this.Files = files;
    this.Output = output;
    this.References = references;
    this.Logs = logs;
  }

  Project.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Project.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Project;
}();

_fableCore.Util.setInterfaces(Project.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Project");

var OpenNamespace = exports.OpenNamespace = function () {
  function OpenNamespace(namespace, name, type, line, column, multipleNames) {
    _classCallCheck(this, OpenNamespace);

    this.Namespace = namespace;
    this.Name = name;
    this.Type = type;
    this.Line = line;
    this.Column = column;
    this.MultipleNames = multipleNames;
  }

  OpenNamespace.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  OpenNamespace.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return OpenNamespace;
}();

_fableCore.Util.setInterfaces(OpenNamespace.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.OpenNamespace");

var QualifySymbol = exports.QualifySymbol = function () {
  function QualifySymbol(name, qualifier) {
    _classCallCheck(this, QualifySymbol);

    this.Name = name;
    this.Qualifier = qualifier;
  }

  QualifySymbol.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  QualifySymbol.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return QualifySymbol;
}();

_fableCore.Util.setInterfaces(QualifySymbol.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.QualifySymbol");

var ResolveNamespace = exports.ResolveNamespace = function () {
  function ResolveNamespace(opens, qualifies, word) {
    _classCallCheck(this, ResolveNamespace);

    this.Opens = opens;
    this.Qualifies = qualifies;
    this.Word = word;
  }

  ResolveNamespace.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  ResolveNamespace.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return ResolveNamespace;
}();

_fableCore.Util.setInterfaces(ResolveNamespace.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.ResolveNamespace");

var UnionCaseGenerator = exports.UnionCaseGenerator = function () {
  function UnionCaseGenerator(text, position) {
    _classCallCheck(this, UnionCaseGenerator);

    this.Text = text;
    this.Position = position;
  }

  UnionCaseGenerator.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  UnionCaseGenerator.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return UnionCaseGenerator;
}();

_fableCore.Util.setInterfaces(UnionCaseGenerator.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.UnionCaseGenerator");

var Result = exports.Result = function () {
  function Result(kind, data) {
    _classCallCheck(this, Result);

    this.Kind = kind;
    this.Data = data;
  }

  Result.prototype.Equals = function Equals(other) {
    return _fableCore.Util.equalsRecords(this, other);
  };

  Result.prototype.CompareTo = function CompareTo(other) {
    return _fableCore.Util.compareRecords(this, other);
  };

  return Result;
}();

_fableCore.Util.setInterfaces(Result.prototype, ["FSharpRecord", "System.IEquatable", "System.IComparable"], "Ionide.VSCode.FSharp.DTO.Result");