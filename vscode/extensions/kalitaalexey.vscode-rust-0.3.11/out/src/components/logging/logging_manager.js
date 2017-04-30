"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const root_logger_1 = require("./root_logger");
class LoggingManager {
    constructor() {
        this.channel = vscode_1.window.createOutputChannel('Rust logging');
        this.logger = new root_logger_1.default('');
        this.logger.setLogFunction((message) => {
            this.channel.appendLine(message);
        });
    }
    getLogger() {
        return this.logger;
    }
}
exports.default = LoggingManager;
//# sourceMappingURL=logging_manager.js.map