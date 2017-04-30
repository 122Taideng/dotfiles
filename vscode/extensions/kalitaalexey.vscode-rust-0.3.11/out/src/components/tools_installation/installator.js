"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const vscode_1 = require("vscode");
const CommandLine_1 = require("../../CommandLine");
const missing_tools_status_bar_item_1 = require("./missing_tools_status_bar_item");
class Installator {
    constructor(context, configurationManager, logger) {
        this.configurationManager = configurationManager;
        this.logger = logger;
        const installToolsCommandName = 'rust.install_missing_tools';
        this.missingToolsStatusBarItem = new missing_tools_status_bar_item_1.default(context, installToolsCommandName);
        this.missingTools = [];
        vscode_1.commands.registerCommand(installToolsCommandName, () => {
            this.offerToInstallMissingTools();
        });
    }
    addStatusBarItemIfSomeToolsAreMissing() {
        this.getMissingTools();
        if (this.missingTools.length === 0) {
            return;
        }
        this.missingToolsStatusBarItem.show();
    }
    offerToInstallMissingTools() {
        // Plurality is important. :')
        const group = this.missingTools.length > 1 ? 'them' : 'it';
        const message = `You are missing ${this.missingTools.join(', ')}. Would you like to install ${group}?`;
        const option = { title: 'Install' };
        vscode_1.window.showInformationMessage(message, option).then(selection => {
            if (selection !== option) {
                return;
            }
            this.installMissingTools();
        });
    }
    installMissingTools() {
        const terminal = vscode_1.window.createTerminal('Rust tools installation');
        // cargo install tool && cargo install another_tool
        const cargoBinPath = this.configurationManager.getCargoPath();
        const shell = vscode_1.workspace.getConfiguration('terminal')['integrated']['shell']['windows'];
        const statements = this.missingTools.map(tool => `${cargoBinPath} install ${tool}`);
        const command = CommandLine_1.getCommandToExecuteStatementsOneByOneIfPreviousIsSucceed(shell, statements);
        terminal.sendText(command);
        terminal.show();
        this.missingToolsStatusBarItem.hide();
    }
    getMissingTools() {
        const logger = this.logger.createChildLogger('getMissingTools(): ');
        const pathDirectories = (process.env.PATH || '').split(path.delimiter);
        logger.debug(`pathDirectories=${JSON.stringify(pathDirectories)}`);
        const tools = {
            'racer': this.configurationManager.getRacerPath(),
            'rustfmt': this.configurationManager.getRustfmtPath(),
            'rustsym': this.configurationManager.getRustsymPath()
        };
        logger.debug(`tools=${JSON.stringify(tools)}`);
        const keys = Object.keys(tools);
        const missingTools = keys.map(tool => {
            // Check if the path exists as-is.
            let userPath = tools[tool];
            if (fs_1.existsSync(userPath)) {
                logger.debug(`${tool}'s path=${userPath}`);
                return undefined;
            }
            // If the extension is running on Windows and no extension was
            // specified (likely because the user didn't configure a custom path),
            // then prefix one for them.
            if (process.platform === 'win32' && path.extname(userPath).length === 0) {
                userPath += '.exe';
            }
            // Check if the tool exists on the PATH
            for (const part of pathDirectories) {
                let binPath = path.join(part, userPath);
                if (fs_1.existsSync(binPath)) {
                    return undefined;
                }
            }
            // The tool wasn't found, we should install it
            return tool;
        }).filter(tool => tool !== undefined);
        this.missingTools = missingTools;
        logger.debug(`this.missingTools = ${JSON.stringify(this.missingTools)}`);
    }
}
exports.default = Installator;
//# sourceMappingURL=installator.js.map