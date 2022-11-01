import * as Common from '../../core/common/common.js';
export declare class ShellMainImpl extends Common.ObjectWrapper.ObjectWrapper implements Common.Runnable.Runnable {
    static instance(opts?: {
        forceNew: boolean | null;
    }): ShellMainImpl;
    run(): Promise<void>;
}
