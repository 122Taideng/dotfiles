"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
/**
 * The class providing an ability to spawn a process and receive content of its both stdout and stderr.
 */
class OutputingProcess {
    /**
     * Spawns a new process
     * @param executable an executable to spawn
     * @param args arguments to pass to the spawned process
     * @param options options to use for the spawning
     */
    static spawn(executable, args, options) {
        const process = child_process_1.spawn(executable, args, options);
        return new Promise(resolve => {
            let wasStdoutClosed = false;
            let wasStderrClosed = false;
            let stdoutData = '';
            let stderrData = '';
            // let errorOccurred = false;
            let exitCode = undefined;
            const onStreamWasClosedOrProcessEnded = () => {
                if (wasStdoutClosed && wasStderrClosed && exitCode !== undefined) {
                    console.log('onStreamWasClosedOrProcessEnded in if');
                    resolve({ stdoutData, stderrData, exitCode });
                }
            };
            process.stdout.on('data', (chunk) => {
                console.log('stdout data');
                if (typeof chunk === 'string') {
                    stdoutData += chunk;
                }
                else {
                    stdoutData += chunk.toString();
                }
            });
            process.stdout.on('close', () => {
                console.log('stdout close');
                wasStdoutClosed = true;
                onStreamWasClosedOrProcessEnded();
            });
            process.stderr.on('data', (chunk) => {
                console.log('stderr data');
                if (typeof chunk === 'string') {
                    stderrData += chunk;
                }
                else {
                    stderrData += chunk.toString();
                }
            });
            process.stderr.on('close', () => {
                console.log('stderr close');
                wasStderrClosed = true;
                onStreamWasClosedOrProcessEnded();
            });
            process.on('error', e => {
                console.log('e', e);
            });
            process.on('exit', code => {
                console.log('57');
                exitCode = code;
                onStreamWasClosedOrProcessEnded();
            });
        });
    }
}
exports.OutputingProcess = OutputingProcess;
//# sourceMappingURL=OutputingProcess.js.map