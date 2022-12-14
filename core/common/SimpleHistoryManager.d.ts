/**
 * @interface
 */
export interface HistoryEntry {
    valid(): boolean;
    reveal(): void;
}
export declare class SimpleHistoryManager {
    private entries;
    private activeEntryIndex;
    private coalescingReadonly;
    private readonly historyDepth;
    constructor(historyDepth: number);
    _readOnlyLock(): void;
    _releaseReadOnlyLock(): void;
    _getPreviousValidIndex(): number;
    _getNextValidIndex(): number;
    _readOnly(): boolean;
    filterOut(filterOutCallback: (arg0: HistoryEntry) => boolean): void;
    empty(): boolean;
    active(): HistoryEntry | null;
    push(entry: HistoryEntry): void;
    canRollback(): boolean;
    canRollover(): boolean;
    rollback(): boolean;
    rollover(): boolean;
}
