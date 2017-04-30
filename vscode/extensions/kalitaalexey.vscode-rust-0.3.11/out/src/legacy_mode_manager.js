"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const completion_manager_1 = require("./components/completion/completion_manager");
const formatting_manager_1 = require("./components/formatting/formatting_manager");
const document_symbol_provision_manager_1 = require("./components/symbol_provision/document_symbol_provision_manager");
const workspace_symbol_provision_manager_1 = require("./components/symbol_provision/workspace_symbol_provision_manager");
const installator_1 = require("./components/tools_installation/installator");
class LegacyModeManager {
    constructor(context, configurationManager, currentWorkingDirectoryManager, logger) {
        this.context = context;
        this.completionManager = new completion_manager_1.default(context, configurationManager, logger.createChildLogger('CompletionManager: '));
        this.formattingManager = new formatting_manager_1.default(context, configurationManager);
        this.workspaceSymbolProvisionManager = new workspace_symbol_provision_manager_1.default(context, configurationManager, currentWorkingDirectoryManager);
        this.documentSymbolProvisionManager = new document_symbol_provision_manager_1.default(context, configurationManager);
        this.missingToolsInstallator = new installator_1.default(context, configurationManager, logger.createChildLogger('MissingToolsInstallator: '));
        this.missingToolsInstallator.addStatusBarItemIfSomeToolsAreMissing();
    }
    start() {
        this.context.subscriptions.push(this.completionManager.disposable());
        this.completionManager.initialStart();
    }
}
exports.default = LegacyModeManager;
//# sourceMappingURL=legacy_mode_manager.js.map