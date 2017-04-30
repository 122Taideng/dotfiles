/*
 * Copyright (c) 2015 "draivin" Ian Ornelas and other contributors.
 * Licensed under MIT (https://github.com/Draivin/vscode-racer/blob/master/LICENSE).
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const vscode_1 = require("vscode");
const tmp_1 = require("tmp");
const mod_1 = require("../configuration/mod");
const racer_status_bar_item_1 = require("./racer_status_bar_item");
class CompletionManager {
    constructor(context, configurationManager, logger) {
        this.typeMap = {
            'Struct': vscode_1.CompletionItemKind.Class,
            'Module': vscode_1.CompletionItemKind.Module,
            'MatchArm': vscode_1.CompletionItemKind.Variable,
            'Function': vscode_1.CompletionItemKind.Function,
            'Crate': vscode_1.CompletionItemKind.Module,
            'Let': vscode_1.CompletionItemKind.Variable,
            'IfLet': vscode_1.CompletionItemKind.Variable,
            'WhileLet': vscode_1.CompletionItemKind.Variable,
            'For': vscode_1.CompletionItemKind.Variable,
            'StructField': vscode_1.CompletionItemKind.Field,
            'Impl': vscode_1.CompletionItemKind.Class,
            'Enum': vscode_1.CompletionItemKind.Enum,
            'EnumVariant': vscode_1.CompletionItemKind.Field,
            'Type': vscode_1.CompletionItemKind.Keyword,
            'FnArg': vscode_1.CompletionItemKind.Property,
            'Trait': vscode_1.CompletionItemKind.Interface,
            'Const': vscode_1.CompletionItemKind.Variable,
            'Static': vscode_1.CompletionItemKind.Variable
        };
        this.configurationManager = configurationManager;
        this.logger = logger;
        this.listeners = [];
        const showErrorCommandName = 'rust.racer.show_error';
        this.racerStatusBarItem = new racer_status_bar_item_1.default(showErrorCommandName);
        context.subscriptions.push(vscode_1.commands.registerCommand(showErrorCommandName, () => {
            this.showErrorBuffer();
        }));
        let tmpFile = tmp_1.fileSync();
        this.tmpFile = tmpFile.name;
    }
    disposable() {
        return new vscode_1.Disposable(() => {
            this.stop();
        });
    }
    /**
     * Starts itself at first time
     */
    initialStart() {
        const isSourceCodeAvailable = this.ensureSourceCodeIsAvailable();
        if (isSourceCodeAvailable) {
            this.start();
        }
    }
    /**
     * Ensures that Rust's source code is available to use
     * @returns flag indicating whether the source code if available or not
     */
    ensureSourceCodeIsAvailable() {
        if (this.configurationManager.getRustSourcePath()) {
            return true;
        }
        const rustcSysRoot = this.configurationManager.getRustcSysRoot();
        if (rustcSysRoot && rustcSysRoot.includes('.rustup')) {
            // tslint:disable-next-line
            const message = 'You are using rustup, but don\'t have installed source code. Do you want to install it?';
            vscode_1.window.showErrorMessage(message, 'Yes').then(chosenItem => {
                if (chosenItem === 'Yes') {
                    const terminal = vscode_1.window.createTerminal('Rust source code installation');
                    terminal.sendText('rustup component add rust-src');
                    terminal.show();
                }
            });
        }
        return false;
    }
    /**
     * Starts Racer as a daemon, adds itself as definition, completion, hover, signature provider
     */
    start() {
        const logger = this.logger.createChildLogger('start: ');
        logger.debug('enter');
        this.commandCallbacks = [];
        this.linesBuffer = [];
        this.dataBuffer = '';
        this.errorBuffer = '';
        this.lastCommand = '';
        this.providers = [];
        this.racerPath = this.configurationManager.getRacerPath();
        logger.debug(`racerPath=${this.racerPath}`);
        this.racerStatusBarItem.showTurnedOn();
        const cargoHomePath = this.configurationManager.getCargoHomePath();
        const racerSpawnOptions = {
            stdio: 'pipe',
            shell: true,
            env: Object.assign({}, process.env)
        };
        const rustSourcePath = this.configurationManager.getRustSourcePath();
        if (rustSourcePath) {
            racerSpawnOptions.env.RUST_SRC_PATH = rustSourcePath;
        }
        if (cargoHomePath) {
            racerSpawnOptions.env.CARGO_HOME = cargoHomePath;
        }
        logger.debug(`ENV[RUST_SRC_PATH] = ${racerSpawnOptions.env['RUST_SRC_PATH']}`);
        this.racerDaemon = child_process_1.spawn(this.racerPath, ['--interface=tab-text', 'daemon'], racerSpawnOptions);
        this.racerDaemon.on('error', (err) => {
            this.logger.error(`racer failed: err = ${err}`);
            this.stopDaemon();
            if (err.code === 'ENOENT') {
                this.racerStatusBarItem.showNotFound();
            }
            else {
                this.racerStatusBarItem.showCrashed();
                this.scheduleRestart();
            }
        });
        this.racerDaemon.on('close', (code, signal) => {
            this.logger.warning(`racer closed: code = ${code}, signal = ${signal}`);
            this.stopDaemon();
            if (code === 0) {
                this.racerStatusBarItem.showTurnedOff();
            }
            else {
                this.racerStatusBarItem.showCrashed();
                this.scheduleRestart();
            }
        });
        this.racerDaemon.stdout.on('data', (data) => {
            this.dataHandler(data);
        });
        this.racerDaemon.stderr.on('data', (data) => {
            this.errorBuffer += data.toString();
        });
        this.hookCapabilities();
        this.listeners.push(vscode_1.workspace.onDidChangeConfiguration(() => {
            const newPath = this.configurationManager.getRacerPath();
            if (this.racerPath !== newPath) {
                this.restart();
            }
        }));
    }
    stop() {
        this.logger.debug('stop');
        this.stopDaemon();
        this.racerStatusBarItem.showTurnedOff();
        this.stopListeners();
        this.clearCommandCallbacks();
    }
    restart() {
        this.logger.warning('restart');
        this.stop();
        this.start();
    }
    scheduleRestart() {
        setTimeout(this.restart.bind(this), 3000);
    }
    stopDaemon() {
        if (!this.racerDaemon) {
            return;
        }
        this.racerDaemon.kill();
        this.racerDaemon = undefined;
        this.providers.forEach(disposable => disposable.dispose());
        this.providers = [];
    }
    stopListeners() {
        this.listeners.forEach(disposable => disposable.dispose());
        this.listeners = [];
    }
    clearCommandCallbacks() {
        this.commandCallbacks.forEach(callback => callback([]));
    }
    showErrorBuffer() {
        let channel = vscode_1.window.createOutputChannel('Racer Error');
        channel.clear();
        channel.append(`Last command: \n${this.lastCommand}\n`);
        channel.append(`Racer Output: \n${this.linesBuffer.join('\n')}\n`);
        channel.append(`Racer Error: \n${this.errorBuffer}`);
        channel.show(true);
    }
    definitionProvider(document, position) {
        let commandArgs = [position.line + 1, position.character, document.fileName, this.tmpFile];
        return this.runCommand(document, 'find-definition', commandArgs).then(lines => {
            if (lines.length === 0) {
                return undefined;
            }
            let result = lines[0];
            let parts = result.split('\t');
            let line = Number(parts[2]) - 1;
            let character = Number(parts[3]);
            let uri = vscode_1.Uri.file(parts[4]);
            return new vscode_1.Location(uri, new vscode_1.Position(line, character));
        });
    }
    hoverProvider(document, position) {
        // Could potentially use `document.getWordRangeAtPosition`.
        let line = document.lineAt(position.line);
        let wordStartIndex = line.text.slice(0, position.character + 1).search(/[a-z0-9_]+$/i);
        let lastCharIndex = line.text.slice(position.character).search(/[^a-z0-9_]/i);
        let wordEndIndex = lastCharIndex === -1 ? 1 + position.character : lastCharIndex + position.character;
        let lineTail = line.text.slice(wordEndIndex).trim();
        let isFunction = lineTail === '' ? false : lineTail[0] === '(';
        let word = line.text.slice(wordStartIndex, wordEndIndex);
        if (!word) {
            return undefined;
        }
        // We are using `complete-with-snippet` instead of `find-definition` because it contains
        // extra information that is not contained in the `find`definition` command, such as documentation.
        let commandArgs = [position.line + 1, wordEndIndex, document.fileName, this.tmpFile];
        return this.runCommand(document, 'complete-with-snippet', commandArgs).then(lines => {
            if (lines.length <= 1) {
                return undefined;
            }
            let results = lines.slice(1).map(x => x.split('\t'));
            let result = isFunction
                ? results.find(parts => parts[2].startsWith(word + '(') && parts[6] === 'Function')
                : results.find(parts => parts[2] === word);
            // We actually found a completion instead of a definition, so we won't show the returned info.
            if (!result) {
                return undefined;
            }
            let match = result[2];
            let type = result[6];
            let definition = type === 'Module' ? 'module ' + match : result[7];
            let docs = JSON.parse(result[8].replace(/\\'/g, "'")).split('\n');
            let bracketIndex = definition.indexOf('{');
            if (bracketIndex !== -1) {
                definition = definition.substring(0, bracketIndex);
            }
            let processedDocs = [{
                    language: 'rust',
                    value: definition.trim()
                }];
            let currentBlock = [];
            let codeBlock = false;
            let extraIndent = 0;
            // The logic to push a block to the processed blocks is a little
            // contrived, depending on if we are inside a language block or not,
            // as the logic has to be repeated at the end of the for block, I
            // preferred to extract it to an inline function.
            function pushBlock() {
                if (codeBlock) {
                    processedDocs.push({
                        language: 'rust',
                        value: currentBlock.join('\n')
                    });
                }
                else {
                    processedDocs.push(currentBlock.join('\n'));
                }
            }
            for (let i = 0; i < docs.length; i++) {
                let docLine = docs[i];
                if (docLine.trim().startsWith('```')) {
                    if (currentBlock.length) {
                        pushBlock();
                        currentBlock = [];
                    }
                    codeBlock = !codeBlock;
                    extraIndent = docLine.indexOf('```');
                    continue;
                }
                if (codeBlock) {
                    if (!docLine.trim().startsWith('# ')) {
                        currentBlock.push(docLine.slice(extraIndent));
                    }
                    continue;
                }
                // When this was implemented (vscode 1.5.1), the markdown headers
                // were a little buggy, with a large margin-botton that pushes the
                // next line far down. As an alternative, I replaced the headers
                // with links (that lead to nowhere), just so there is some highlight.
                //
                // The preferred alternative would be to just make the headers a little
                // smaller and otherwise draw them as is.
                if (docLine.trim().startsWith('#')) {
                    let headerMarkupEnd = docLine.trim().search(/[^# ]/);
                    currentBlock.push('[' + docLine.trim().slice(headerMarkupEnd) + ']()');
                    continue;
                }
                currentBlock.push(docLine);
            }
            if (currentBlock.length) {
                pushBlock();
            }
            return new vscode_1.Hover(processedDocs);
        });
    }
    completionProvider(document, position) {
        let commandArgs = [position.line + 1, position.character, document.fileName, this.tmpFile];
        return this.runCommand(document, 'complete-with-snippet', commandArgs).then(lines => {
            lines.shift();
            // Split on MATCH, as a definition can span more than one line
            lines = lines.map(l => l.trim()).join('').split('MATCH\t').slice(1);
            let completions = [];
            for (let line of lines) {
                let parts = line.split('\t');
                let label = parts[0];
                let type = parts[5];
                let detail = parts[6];
                let kind;
                if (type in this.typeMap) {
                    kind = this.typeMap[type];
                }
                else {
                    console.warn('Kind not mapped: ' + type);
                    kind = vscode_1.CompletionItemKind.Text;
                }
                // Remove trailing bracket
                if (type !== 'Module' && type !== 'Crate') {
                    let bracketIndex = detail.indexOf('{');
                    if (bracketIndex === -1) {
                        bracketIndex = detail.length;
                    }
                    detail = detail.substring(0, bracketIndex).trim();
                }
                completions.push({ label, kind, detail });
            }
            return completions;
        });
    }
    parseParameters(text, startingPosition) {
        let stopPosition = text.length;
        let parameters = [];
        let currentParameter = '';
        let currentDepth = 0;
        let parameterStart = -1;
        let parameterEnd = -1;
        for (let i = startingPosition; i < stopPosition; i++) {
            let char = text.charAt(i);
            if (char === '(') {
                if (currentDepth === 0) {
                    parameterStart = i;
                }
                currentDepth += 1;
                continue;
            }
            else if (char === ')') {
                currentDepth -= 1;
                if (currentDepth === 0) {
                    parameterEnd = i;
                    break;
                }
                continue;
            }
            if (currentDepth === 0) {
                continue;
            }
            if (currentDepth === 1 && char === ',') {
                parameters.push(currentParameter);
                currentParameter = '';
            }
            else {
                currentParameter += char;
            }
        }
        parameters.push(currentParameter);
        return [parameters, parameterStart, parameterEnd];
    }
    parseCall(name, args, definition, callText) {
        let nameEnd = definition.indexOf(name) + name.length;
        let [params, paramStart, paramEnd] = this.parseParameters(definition, nameEnd);
        let [callParameters] = this.parseParameters(callText, 0);
        let currentParameter = callParameters.length - 1;
        let nameTemplate = definition.substring(0, paramStart);
        // If function is used as a method, ignore the self parameter
        if ((args ? args.length : 0) < params.length) {
            params = params.slice(1);
        }
        let result = new vscode_1.SignatureHelp();
        result.activeSignature = 0;
        result.activeParameter = currentParameter;
        let signature = new vscode_1.SignatureInformation(nameTemplate);
        signature.label += '(';
        params.forEach((param, i) => {
            let parameter = new vscode_1.ParameterInformation(param, '');
            signature.label += parameter.label;
            signature.parameters.push(parameter);
            if (i !== params.length - 1) {
                signature.label += ', ';
            }
        });
        signature.label += ') ';
        let bracketIndex = definition.indexOf('{', paramEnd);
        if (bracketIndex === -1) {
            bracketIndex = definition.length;
        }
        // Append return type without possible trailing bracket
        signature.label += definition.substring(paramEnd + 1, bracketIndex).trim();
        result.signatures.push(signature);
        return result;
    }
    firstDanglingParen(document, position) {
        let text = document.getText();
        let offset = document.offsetAt(position) - 1;
        let currentDepth = 0;
        while (offset > 0) {
            let char = text.charAt(offset);
            if (char === ')') {
                currentDepth += 1;
            }
            else if (char === '(') {
                currentDepth -= 1;
            }
            else if (char === '{') {
                return undefined; // not inside function call
            }
            if (currentDepth === -1) {
                return document.positionAt(offset);
            }
            offset--;
        }
        return undefined;
    }
    signatureHelpProvider(document, position) {
        // Get the first dangling parenthesis, so we don't stop on a function call used as a previous parameter
        const startPos = this.firstDanglingParen(document, position);
        if (!startPos) {
            return undefined;
        }
        const name = document.getText(document.getWordRangeAtPosition(startPos));
        const commandArgs = [startPos.line + 1, startPos.character - 1, document.fileName, this.tmpFile];
        return this.runCommand(document, 'complete-with-snippet', commandArgs).then((lines) => {
            lines = lines.map(l => l.trim()).join('').split('MATCH\t').slice(1);
            let parts = [];
            for (const line of lines) {
                parts = line.split('\t');
                if (parts[0] === name) {
                    break;
                }
            }
            if (!parts) {
                return undefined;
            }
            const args = parts[1].match(/\${\d+:\w+}/g);
            if (!args) {
                return undefined;
            }
            const type = parts[5];
            const definition = parts[6];
            if (type !== 'Function') {
                return null;
            }
            const callText = document.getText(new vscode_1.Range(startPos, position));
            return this.parseCall(name, args, definition, callText);
        });
    }
    hookCapabilities() {
        let definitionProvider = { provideDefinition: this.definitionProvider.bind(this) };
        this.providers.push(vscode_1.languages.registerDefinitionProvider(mod_1.default(), definitionProvider));
        let completionProvider = { provideCompletionItems: this.completionProvider.bind(this) };
        this.providers.push(vscode_1.languages.registerCompletionItemProvider(mod_1.default(), completionProvider, ...['.', ':']));
        let signatureProvider = { provideSignatureHelp: this.signatureHelpProvider.bind(this) };
        this.providers.push(vscode_1.languages.registerSignatureHelpProvider(mod_1.default(), signatureProvider, ...['(', ',']));
        let hoverProvider = { provideHover: this.hoverProvider.bind(this) };
        this.providers.push(vscode_1.languages.registerHoverProvider(mod_1.default(), hoverProvider));
    }
    dataHandler(data) {
        // Ensure we only start parsing when the whole line has been flushed.
        // It can happen that when a line goes over a certain length, racer will
        // flush it one part at a time, if we don't wait for the whole line to
        // be flushed, we will consider each part of the original line a separate
        // line.
        let dataStr = data.toString();
        if (!/\r?\n$/.test(dataStr)) {
            this.dataBuffer += dataStr;
            return;
        }
        let lines = (this.dataBuffer + dataStr).split(/\r?\n/);
        this.dataBuffer = '';
        for (let line of lines) {
            if (line.length === 0) {
                continue;
            }
            else if (line.startsWith('END')) {
                const callback = this.commandCallbacks.shift();
                if (callback !== undefined) {
                    callback(this.linesBuffer);
                }
                this.linesBuffer = [];
            }
            else {
                this.linesBuffer.push(line);
            }
        }
    }
    updateTmpFile(document) {
        fs_1.writeFileSync(this.tmpFile, document.getText());
    }
    runCommand(document, command, args) {
        if (!this.racerDaemon) {
            return Promise.reject(undefined);
        }
        this.updateTmpFile(document);
        let queryString = [command, ...args].join('\t') + '\n';
        this.lastCommand = queryString;
        let promise = new Promise(resolve => {
            this.commandCallbacks.push(resolve);
        });
        this.racerDaemon.stdin.write(queryString);
        return promise;
    }
}
exports.default = CompletionManager;
//# sourceMappingURL=completion_manager.js.map