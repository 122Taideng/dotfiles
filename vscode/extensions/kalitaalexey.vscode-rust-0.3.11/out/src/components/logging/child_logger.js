"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
class ChildLogger extends logger_1.Logger {
    createChildLogger(loggingMessagePrefix) {
        return new ChildLogger(loggingMessagePrefix, this);
    }
    constructor(loggingMessagePrefix, parent) {
        super(loggingMessagePrefix);
        this.parent = parent;
    }
    debugProtected(message) {
        this.parent.debug(this.getLoggingMessagePrefix().concat(message));
    }
    errorProtected(message) {
        this.parent.error(this.getLoggingMessagePrefix().concat(message));
    }
    warningProtected(message) {
        this.parent.warning(this.getLoggingMessagePrefix().concat(message));
    }
}
exports.default = ChildLogger;
//# sourceMappingURL=child_logger.js.map