import { ElementFocusRestorer } from './UIUtils.js';
import { VBox } from './Widget.js';
export declare class ListWidget<T> extends VBox {
    _delegate: Delegate<T>;
    _list: HTMLElement;
    _lastSeparator: boolean;
    _focusRestorer: ElementFocusRestorer | null;
    _items: T[];
    _editable: boolean[];
    _elements: Element[];
    _editor: Editor<T> | null;
    _editItem: T | null;
    _editElement: Element | null;
    _emptyPlaceholder: Element | null;
    constructor(delegate: Delegate<T>, delegatesFocus?: boolean | undefined);
    clear(): void;
    appendItem(item: T, editable: boolean): void;
    appendSeparator(): void;
    removeItem(index: number): void;
    addNewItem(index: number, item: T): void;
    setEmptyPlaceholder(element: Element | null): void;
    _createControls(item: T, element: Element): Element;
    wasShown(): void;
    _updatePlaceholder(): void;
    _startEditing(item: T, element: Element | null, insertionPoint: Element | null): void;
    _commitEditing(): void;
    _stopEditing(): void;
}
export interface Delegate<T> {
    renderItem(item: T, editable: boolean): Element;
    removeItemRequested(item: T, index: number): void;
    beginEdit(item: T): Editor<T>;
    commitEdit(item: T, editor: Editor<T>, isNew: boolean): void;
}
export interface CustomEditorControl<T> extends HTMLElement {
    value: T;
    validate: () => ValidatorResult;
}
export declare type EditorControl<T = string> = (HTMLInputElement | HTMLSelectElement | CustomEditorControl<T>);
export declare class Editor<T> {
    element: HTMLDivElement;
    _contentElement: HTMLElement;
    _commitButton: HTMLButtonElement;
    _cancelButton: HTMLButtonElement;
    _errorMessageContainer: HTMLElement;
    _controls: EditorControl[];
    _controlByName: Map<string, EditorControl>;
    _validators: ((arg0: T, arg1: number, arg2: EditorControl) => ValidatorResult)[];
    _commit: (() => void) | null;
    _cancel: (() => void) | null;
    _item: T | null;
    _index: number;
    constructor();
    contentElement(): Element;
    createInput(name: string, type: string, title: string, validator: (arg0: T, arg1: number, arg2: EditorControl) => ValidatorResult): HTMLInputElement;
    createSelect(name: string, options: string[], validator: (arg0: T, arg1: number, arg2: EditorControl) => ValidatorResult, title?: string): HTMLSelectElement;
    createCustomControl<S, U extends CustomEditorControl<S>>(name: string, ctor: {
        new (): U;
    }, validator: (arg0: T, arg1: number, arg2: EditorControl) => ValidatorResult): CustomEditorControl<S>;
    control(name: string): EditorControl;
    _validateControls(forceValid: boolean): void;
    requestValidation(): void;
    beginEdit(item: T, index: number, commitButtonTitle: string, commit: () => void, cancel: () => void): void;
    _commitClicked(): void;
    _cancelClicked(): void;
}
export interface ValidatorResult {
    valid: boolean;
    errorMessage?: string;
}
