import type * as Common from '../../core/common/common.js';
import * as Workspace from '../../models/workspace/workspace.js';
import * as QuickOpen from '../../ui/legacy/components/quick_open/quick_open.js';
import { FilePathScoreFunction } from './FilePathScoreFunction.js';
export declare class FilteredUISourceCodeListProvider extends QuickOpen.FilteredListWidget.Provider {
    _queryLineNumberAndColumnNumber: string;
    _defaultScores: Map<Workspace.UISourceCode.UISourceCode, number> | null;
    _scorer: FilePathScoreFunction;
    _uiSourceCodes: Workspace.UISourceCode.UISourceCode[];
    _uiSourceCodeUrls: Set<string>;
    _query: string;
    constructor();
    _projectRemoved(event: Common.EventTarget.EventTargetEvent): void;
    _populate(skipProject?: Workspace.Workspace.Project): void;
    _filterUISourceCode(uiSourceCode: Workspace.UISourceCode.UISourceCode): boolean;
    uiSourceCodeSelected(_uiSourceCode: Workspace.UISourceCode.UISourceCode | null, _lineNumber?: number, _columnNumber?: number): void;
    filterProject(_project: Workspace.Workspace.Project): boolean;
    itemCount(): number;
    itemKeyAt(itemIndex: number): string;
    setDefaultScores(defaultScores: Map<Workspace.UISourceCode.UISourceCode, number> | null): void;
    itemScoreAt(itemIndex: number, query: string): number;
    renderItem(itemIndex: number, query: string, titleElement: Element, subtitleElement: Element): void;
    _renderSubtitleElement(element: Element, text: string): void;
    selectItem(itemIndex: number | null, promptValue: string): void;
    rewriteQuery(query: string): string;
    _uiSourceCodeAdded(event: Common.EventTarget.EventTargetEvent): void;
    notFoundText(): string;
    attach(): void;
    detach(): void;
}
