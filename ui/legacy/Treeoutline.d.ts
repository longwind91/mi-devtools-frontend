import * as Common from '../../core/common/common.js';
import type { Icon } from './Icon.js';
import type { Config } from './InplaceEditor.js';
export declare class TreeOutline extends Common.ObjectWrapper.ObjectWrapper {
    _rootElement: TreeElement;
    _renderSelection: boolean;
    selectedTreeElement: TreeElement | null;
    expandTreeElementsWhenArrowing: boolean;
    _comparator: ((arg0: TreeElement, arg1: TreeElement) => number) | null;
    contentElement: HTMLOListElement;
    _preventTabOrder: boolean;
    _showSelectionOnKeyboardFocus: boolean;
    _focusable: boolean;
    element: HTMLElement;
    _useLightSelectionColor: boolean;
    _treeElementToScrollIntoView: TreeElement | null;
    _centerUponScrollIntoView: boolean;
    constructor();
    setShowSelectionOnKeyboardFocus(show: boolean, preventTabOrder?: boolean): void;
    _createRootElement(): TreeElement;
    rootElement(): TreeElement;
    firstChild(): TreeElement | null;
    _lastDescendent(): TreeElement | null;
    appendChild(child: TreeElement, comparator?: ((arg0: TreeElement, arg1: TreeElement) => number)): void;
    insertChild(child: TreeElement, index: number): void;
    removeChild(child: TreeElement): void;
    removeChildren(): void;
    treeElementFromPoint(x: number, y: number): TreeElement | null;
    treeElementFromEvent(event: MouseEvent | null): TreeElement | null;
    setComparator(comparator: ((arg0: TreeElement, arg1: TreeElement) => number) | null): void;
    setFocusable(focusable: boolean): void;
    updateFocusable(): void;
    focus(): void;
    useLightSelectionColor(): void;
    _bindTreeElement(element: TreeElement): void;
    _unbindTreeElement(element: TreeElement): void;
    selectPrevious(): boolean;
    selectNext(): boolean;
    forceSelect(omitFocus?: boolean | undefined, selectedByUser?: boolean | undefined): void;
    _selectFirst(omitFocus?: boolean | undefined, selectedByUser?: boolean | undefined): boolean;
    _selectLast(): boolean;
    _treeKeyDown(event: KeyboardEvent): void;
    _deferredScrollIntoView(treeElement: TreeElement, center: boolean): void;
    onStartedEditingTitle(_treeElement: TreeElement): void;
}
export declare enum Events {
    ElementAttached = "ElementAttached",
    ElementsDetached = "ElementsDetached",
    ElementExpanded = "ElementExpanded",
    ElementCollapsed = "ElementCollapsed",
    ElementSelected = "ElementSelected"
}
export declare class TreeOutlineInShadow extends TreeOutline {
    element: HTMLElement;
    _shadowRoot: ShadowRoot;
    _disclosureElement: Element;
    _renderSelection: boolean;
    constructor();
    registerRequiredCSS(cssFile: string): void;
    registerCSSFiles(cssFiles: CSSStyleSheet[]): void;
    hideOverflow(): void;
    makeDense(): void;
    onStartedEditingTitle(treeElement: TreeElement): void;
}
export declare const treeElementBylistItemNode: WeakMap<Node, TreeElement>;
export declare class TreeElement {
    treeOutline: TreeOutline | null;
    parent: TreeElement | null;
    previousSibling: TreeElement | null;
    nextSibling: TreeElement | null;
    _boundOnFocus: () => void;
    _boundOnBlur: () => void;
    _listItemNode: HTMLLIElement;
    titleElement: Node;
    _title: string | Node;
    _children: TreeElement[] | null;
    _childrenListNode: HTMLOListElement;
    _hidden: boolean;
    _selectable: boolean;
    expanded: boolean;
    selected: boolean;
    _expandable: boolean;
    _collapsible: boolean;
    toggleOnClick: boolean;
    button: HTMLButtonElement | null;
    root: boolean;
    _tooltip: string;
    _leadingIconsElement: HTMLElement | null;
    _trailingIconsElement: HTMLElement | null;
    _selectionElement: HTMLElement | null;
    _disableSelectFocus: boolean;
    constructor(title?: string | Node, expandable?: boolean);
    static getTreeElementBylistItemNode(node: Node): TreeElement | undefined;
    hasAncestor(ancestor: TreeElement | null): boolean;
    hasAncestorOrSelf(ancestor: TreeElement | null): boolean;
    isHidden(): boolean;
    children(): TreeElement[];
    childCount(): number;
    firstChild(): TreeElement | null;
    lastChild(): TreeElement | null;
    childAt(index: number): TreeElement | null;
    indexOfChild(child: TreeElement): number;
    appendChild(child: TreeElement, comparator?: ((arg0: TreeElement, arg1: TreeElement) => number)): void;
    insertChild(child: TreeElement, index: number): void;
    removeChildAtIndex(childIndex: number): void;
    removeChild(child: TreeElement): void;
    removeChildren(): void;
    get selectable(): boolean;
    set selectable(x: boolean);
    get listItemElement(): HTMLLIElement;
    get childrenListElement(): HTMLOListElement;
    get title(): string | Node;
    set title(x: string | Node);
    titleAsText(): string;
    startEditingTitle<T>(editingConfig: Config<T>): void;
    setLeadingIcons(icons: Icon[]): void;
    setTrailingIcons(icons: Icon[]): void;
    get tooltip(): string;
    set tooltip(x: string);
    isExpandable(): boolean;
    setExpandable(expandable: boolean): void;
    setCollapsible(collapsible: boolean): void;
    get hidden(): boolean;
    set hidden(x: boolean);
    invalidateChildren(): void;
    _ensureSelection(): void;
    _treeElementToggled(event: MouseEvent): void;
    _handleMouseDown(event: MouseEvent): void;
    _handleDoubleClick(event: Event): void;
    _detach(): void;
    collapse(): void;
    collapseRecursively(): void;
    collapseChildren(): void;
    expand(): void;
    expandRecursively(maxDepth?: number): Promise<void>;
    collapseOrAscend(altKey: boolean): boolean;
    descendOrExpand(altKey: boolean): boolean;
    reveal(center?: boolean): void;
    revealed(): boolean;
    selectOnMouseDown(event: MouseEvent): void;
    select(omitFocus?: boolean, selectedByUser?: boolean): boolean;
    _setFocusable(focusable: boolean): void;
    _onFocus(): void;
    _onBlur(): void;
    revealAndSelect(omitFocus?: boolean): void;
    deselect(): void;
    _populateIfNeeded(): Promise<void>;
    onpopulate(): Promise<void>;
    onenter(): boolean;
    ondelete(): boolean;
    onspace(): boolean;
    onbind(): void;
    onunbind(): void;
    onattach(): void;
    onexpand(): void;
    oncollapse(): void;
    ondblclick(_e: Event): boolean;
    onselect(_selectedByUser?: boolean): boolean;
    traverseNextTreeElement(skipUnrevealed: boolean, stayWithin?: TreeElement | null, dontPopulate?: boolean, info?: {
        depthChange: number;
    }): TreeElement | null;
    traversePreviousTreeElement(skipUnrevealed: boolean, dontPopulate?: boolean): TreeElement | null;
    isEventWithinDisclosureTriangle(event: MouseEvent): boolean;
    setDisableSelectFocus(toggle: boolean): void;
}
