"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vscode_1 = require("vscode");
const diagnostic_parser_1 = require("./diagnostic_parser");
const diagnostic_utils_1 = require("./diagnostic_utils");
const output_channel_wrapper_1 = require("./output_channel_wrapper");
const output_channel_task_status_bar_item_1 = require("./output_channel_task_status_bar_item");
const task_1 = require("./task");
class OutputChannelTaskManager {
    constructor(configurationManager, logger, stopCommandName) {
        this.channel = new output_channel_wrapper_1.OutputChannelWrapper(vscode_1.window.createOutputChannel('Cargo'));
        this.configurationManager = configurationManager;
        this.logger = logger;
        this.diagnostics = vscode_1.languages.createDiagnosticCollection('rust');
        this.diagnosticParser = new diagnostic_parser_1.DiagnosticParser();
        this.statusBarItem = new output_channel_task_status_bar_item_1.OutputChannelTaskStatusBarItem(stopCommandName);
    }
    startTask(command, args, cwd, parseOutput, shouldShowOutputChannnel) {
        return __awaiter(this, void 0, void 0, function* () {
            const cargoCwd = this.configurationManager.getCargoCwd();
            /**
             * Prepends the manifest path to arguments
             * if the command should be executed in a directory
             * which differs from the directory containing Cargo.toml.
             */
            function prependArgsWithManifestPathIfRequired() {
                if (!cargoCwd || cargoCwd === cwd) {
                    return;
                }
                const manifestPath = path_1.join(cwd, 'Cargo.toml');
                args = ['--manifest-path', manifestPath].concat(args);
            }
            function prependArgsWithMessageFormatIfRequired() {
                if (!parseOutput) {
                    return;
                }
                // Prepend arguments with arguments making cargo print output in JSON.
                switch (command) {
                    case 'build':
                    case 'check':
                    case 'clippy':
                    case 'test':
                    case 'run':
                        args = ['--message-format', 'json'].concat(args);
                        break;
                }
            }
            prependArgsWithMessageFormatIfRequired();
            prependArgsWithManifestPathIfRequired();
            // Prepend arguments with a command.
            args = [command].concat(args);
            // Change cwd if the user specified custom cwd.
            if (cargoCwd !== undefined) {
                cwd = cargoCwd;
            }
            this.runningTask = new task_1.Task(this.configurationManager, this.logger.createChildLogger('Task: '), args, cwd);
            this.runningTask.setStarted(() => {
                this.channel.clear();
                this.channel.append(`Working directory: ${cwd}\n`);
                this.channel.append(`Started cargo ${args.join(' ')}\n\n`);
                this.diagnostics.clear();
            });
            this.runningTask.setLineReceivedInStdout(line => {
                if (parseOutput && line.startsWith('{')) {
                    const fileDiagnostics = this.diagnosticParser.parseLine(line);
                    for (const fileDiagnostic of fileDiagnostics) {
                        fileDiagnostic.filePath = diagnostic_utils_1.normalizeDiagnosticPath(fileDiagnostic.filePath, cwd);
                        diagnostic_utils_1.addUniqueDiagnostic(fileDiagnostic, this.diagnostics);
                    }
                }
                else {
                    this.channel.append(`${line}\n`);
                }
            });
            this.runningTask.setLineReceivedInStderr(line => {
                this.channel.append(`${line}\n`);
            });
            if (shouldShowOutputChannnel) {
                this.channel.show();
            }
            this.statusBarItem.show();
            let exitCode;
            try {
                exitCode = yield this.runningTask.execute();
            }
            catch (error) {
                this.statusBarItem.hide();
                this.runningTask = undefined;
                // No error means the task has been interrupted
                if (error && error.message === 'ENOENT') {
                    const message = 'The "cargo" command is not available. Make sure it is installed.';
                    vscode_1.window.showInformationMessage(message);
                }
                return;
            }
            this.statusBarItem.hide();
            this.runningTask = undefined;
            this.channel.append(`\nCompleted with code ${exitCode}\n`);
        });
    }
    hasRunningTask() {
        return this.runningTask !== undefined;
    }
    stopRunningTask() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.runningTask !== undefined) {
                yield this.runningTask.kill();
            }
        });
    }
}
exports.OutputChannelTaskManager = OutputChannelTaskManager;
//# sourceMappingURL=output_channel_task_manager.js.map