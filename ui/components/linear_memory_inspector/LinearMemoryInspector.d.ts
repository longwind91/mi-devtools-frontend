import type { ValueType, ValueTypeMode } from './ValueInterpreterDisplayUtils.js';
import { Endianness } from './ValueInterpreterDisplayUtils.js';
export interface LinearMemoryInspectorData {
    memory: Uint8Array;
    address: number;
    memoryOffset: number;
    outerMemoryLength: number;
    valueTypes?: Set<ValueType>;
    valueTypeModes?: Map<ValueType, ValueTypeMode>;
    endianness?: Endianness;
}
export declare type Settings = {
    valueTypes: Set<ValueType>;
    modes: Map<ValueType, ValueTypeMode>;
    endianness: Endianness;
};
export declare class MemoryRequestEvent extends Event {
    data: {
        start: number;
        end: number;
        address: number;
    };
    constructor(start: number, end: number, address: number);
}
export declare class AddressChangedEvent extends Event {
    data: number;
    constructor(address: number);
}
export declare class SettingsChangedEvent extends Event {
    data: Settings;
    constructor(settings: Settings);
}
export declare class LinearMemoryInspector extends HTMLElement {
    static readonly litTagName: import("../../lit-html/static.js").Static;
    private readonly shadow;
    private readonly history;
    private memory;
    private memoryOffset;
    private outerMemoryLength;
    private address;
    private currentNavigatorMode;
    private currentNavigatorAddressLine;
    private numBytesPerPage;
    private valueTypeModes;
    private valueTypes;
    private endianness;
    connectedCallback(): void;
    set data(data: LinearMemoryInspectorData);
    private render;
    private onJumpToPointerAddress;
    private onRefreshRequest;
    private onByteSelected;
    private createSettings;
    private onEndiannessChanged;
    private isValidAddress;
    private onAddressChange;
    private onValueTypeToggled;
    private onValueTypeModeChanged;
    private navigateHistory;
    private navigatePage;
    private jumpToAddress;
    private getPageRangeForAddress;
    private resize;
    private update;
    private setAddress;
}
export interface LinearMemoryInspectorEventMap extends HTMLElementEventMap {
    'memoryrequest': MemoryRequestEvent;
    'addresschanged': AddressChangedEvent;
    'settingschanged': SettingsChangedEvent;
}
export interface LinearMemoryInspector extends HTMLElement {
    addEventListener<K extends keyof LinearMemoryInspectorEventMap>(type: K, listener: (this: HTMLElement, ev: LinearMemoryInspectorEventMap[K]) => unknown, options?: boolean | AddEventListenerOptions): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'devtools-linear-memory-inspector-inspector': LinearMemoryInspector;
    }
}
