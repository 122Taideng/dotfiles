"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
class SysRootManagedByRustup {
    /**
     * Checks if the specified sys root path is managed by rustup.
     * If it is returns a new instance of the class, returns undefined otherwise.
     */
    static create(sysRootPath) {
        if (this.isSysRootManagedByRustup(sysRootPath)) {
            return new SysRootManagedByRustup(sysRootPath);
        }
        else {
            return undefined;
        }
    }
    /**
     * @param sysRootPath The path to the sys root to be checked
     * @returns true if the specified sys root is managed by rustup, false otherwise
     */
    static isSysRootManagedByRustup(sysRootPath) {
        const isSysRootManagedByRustup = sysRootPath.includes('.rustup');
        return isSysRootManagedByRustup;
    }
    /**
     * @returns the path to the directory in which rustup install Rust's source code
     */
    getSourceCodePath() {
        const rustSourcePath = path_1.join(this.sysRootPath, 'lib', 'rustlib', 'src', 'rust', 'src');
        return rustSourcePath;
    }
    constructor(sysRootPath) {
        this.sysRootPath = sysRootPath;
    }
}
exports.SysRootManagedByRustup = SysRootManagedByRustup;
//# sourceMappingURL=rustup.js.map