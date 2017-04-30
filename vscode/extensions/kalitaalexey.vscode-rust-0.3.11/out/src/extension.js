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
const vscode_1 = require("vscode");
const cargo_manager_1 = require("./components/cargo/cargo_manager");
const configuration_manager_1 = require("./components/configuration/configuration_manager");
const current_working_directory_manager_1 = require("./components/configuration/current_working_directory_manager");
const manager_1 = require("./components/language_client/manager");
const logging_manager_1 = require("./components/logging/logging_manager");
const legacy_mode_manager_1 = require("./legacy_mode_manager");
function activate(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const loggingManager = new logging_manager_1.default();
        const logger = loggingManager.getLogger();
        const configurationManager = yield configuration_manager_1.ConfigurationManager.create();
        const currentWorkingDirectoryManager = new current_working_directory_manager_1.default();
        const cargoManager = new cargo_manager_1.CargoManager(ctx, configurationManager, currentWorkingDirectoryManager, logger.createChildLogger('Cargo Manager: '));
        chooseModeAndRun(ctx, logger, configurationManager, currentWorkingDirectoryManager);
        addExecutingActionOnSave(ctx, configurationManager, cargoManager);
    });
}
exports.activate = activate;
function chooseModeAndRun(context, logger, configurationManager, currentWorkingDirectoryManager) {
    const rlsConfiguration = configurationManager.getRlsConfiguration();
    if (rlsConfiguration !== undefined) {
        let { executable, args, env, revealOutputChannelOn } = rlsConfiguration;
        if (!env) {
            env = {};
        }
        if (!env.RUST_SRC_PATH) {
            env.RUST_SRC_PATH = configurationManager.getRustSourcePath();
        }
        const languageClientManager = new manager_1.Manager(context, logger.createChildLogger('Language Client Manager: '), executable, args, env, revealOutputChannelOn);
        languageClientManager.initialStart();
    }
    else {
        const legacyModeManager = new legacy_mode_manager_1.default(context, configurationManager, currentWorkingDirectoryManager, logger.createChildLogger('Legacy Mode Manager: '));
        legacyModeManager.start();
    }
}
function addExecutingActionOnSave(context, configurationManager, cargoManager) {
    context.subscriptions.push(vscode_1.workspace.onDidSaveTextDocument(document => {
        if (!vscode_1.window.activeTextEditor) {
            return;
        }
        const activeDocument = vscode_1.window.activeTextEditor.document;
        if (document !== activeDocument) {
            return;
        }
        if (document.languageId !== 'rust' || !document.fileName.endsWith('.rs')) {
            return;
        }
        const actionOnSave = configurationManager.getActionOnSave();
        if (!actionOnSave) {
            return;
        }
        switch (actionOnSave) {
            case 'build':
                cargoManager.executeBuildTask(cargo_manager_1.CommandInvocationReason.ActionOnSave);
                break;
            case 'check':
                cargoManager.executeCheckTask(cargo_manager_1.CommandInvocationReason.ActionOnSave);
                break;
            case 'clippy':
                cargoManager.executeClippyTask(cargo_manager_1.CommandInvocationReason.ActionOnSave);
                break;
            case 'doc':
                cargoManager.executeDocTask(cargo_manager_1.CommandInvocationReason.ActionOnSave);
                break;
            case 'run':
                cargoManager.executeRunTask(cargo_manager_1.CommandInvocationReason.ActionOnSave);
                break;
            case 'test':
                cargoManager.executeTestTask(cargo_manager_1.CommandInvocationReason.ActionOnSave);
                break;
        }
    }));
}
//# sourceMappingURL=extension.js.map