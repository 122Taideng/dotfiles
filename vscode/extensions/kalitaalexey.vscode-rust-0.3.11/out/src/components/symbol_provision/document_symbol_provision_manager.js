"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const mod_1 = require("../configuration/mod");
const symbol_search_manager_1 = require("./symbol_search_manager");
class DocumentSymbolProvisionManager {
    constructor(context, configurationManager) {
        this.symbolSearchManager = new symbol_search_manager_1.default(configurationManager);
        context.subscriptions.push(vscode_1.languages.registerDocumentSymbolProvider(mod_1.default(), this));
    }
    provideDocumentSymbols(document) {
        return this.symbolSearchManager.findSymbolsInDocument(document.fileName);
    }
}
exports.default = DocumentSymbolProvisionManager;
//# sourceMappingURL=document_symbol_provision_manager.js.map