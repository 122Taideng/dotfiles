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
const CommandLine_1 = require("../../CommandLine");
const helper_1 = require("./helper");
class TerminalTaskManager {
    constructor(context, configurationManager) {
        this.configurationManager = configurationManager;
        context.subscriptions.push(vscode_1.window.onDidCloseTerminal(closedTerminal => {
            if (closedTerminal === this.runningTerminal) {
                this.runningTerminal = undefined;
            }
        }));
    }
    execute(command, args, cwd) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.runningTerminal) {
                const helper = new helper_1.Helper(this.configurationManager);
                const result = yield helper.handleCommandStartWhenThereIsRunningCommand();
                switch (result) {
                    case helper_1.CommandStartHandleResult.IgnoreNewCommand:
                        return;
                    case helper_1.CommandStartHandleResult.StopRunningCommand:
                        this.runningTerminal.dispose();
                        this.runningTerminal = undefined;
                }
            }
            const terminal = vscode_1.window.createTerminal('Cargo Task');
            this.runningTerminal = terminal;
            const setEnvironmentVariables = () => {
                const cargoEnv = this.configurationManager.getCargoEnv();
                const shell = vscode_1.workspace.getConfiguration('terminal')['integrated']['shell']['windows'];
                // Set environment variables
                for (let name in cargoEnv) {
                    if (name in cargoEnv) {
                        const value = cargoEnv[name];
                        terminal.sendText(CommandLine_1.getCommandToSetEnvVar(shell, name, value));
                    }
                }
            };
            setEnvironmentVariables();
            const cargoCwd = this.configurationManager.getCargoCwd();
            if (cargoCwd !== undefined && cargoCwd !== cwd) {
                const manifestPath = path_1.join(cwd, 'Cargo.toml');
                args = ['--manifest-path', manifestPath].concat(args);
                cwd = cargoCwd;
            }
            // Change the current directory to a specified directory
            this.runningTerminal.sendText(`cd "${cwd}"`);
            const cargoPath = this.configurationManager.getCargoPath();
            // Start a requested command
            this.runningTerminal.sendText(`${cargoPath} ${command} ${args.join(' ')}`);
            this.runningTerminal.show(true);
        });
    }
}
exports.TerminalTaskManager = TerminalTaskManager;
//# sourceMappingURL=terminal_task_manager.js.map