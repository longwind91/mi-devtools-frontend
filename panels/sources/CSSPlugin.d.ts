import * as Common from '../../core/common/common.js';
import * as TextUtils from '../../models/text_utils/text_utils.js';
import type * as Workspace from '../../models/workspace/workspace.js';
import * as ColorPicker from '../../ui/legacy/components/color_picker/color_picker.js';
import * as InlineEditor from '../../ui/legacy/components/inline_editor/inline_editor.js';
import * as SourceFrame from '../../ui/legacy/components/source_frame/source_frame.js';
import * as UI from '../../ui/legacy/legacy.js';
import { Plugin } from './Plugin.js';
export declare class CSSPlugin extends Plugin {
    _textEditor: SourceFrame.SourcesTextEditor.SourcesTextEditor;
    _swatchPopoverHelper: InlineEditor.SwatchPopoverHelper.SwatchPopoverHelper;
    _muteSwatchProcessing: boolean;
    _hadSwatchChange: boolean;
    _bezierEditor: InlineEditor.BezierEditor.BezierEditor | null;
    _editedSwatchTextRange: TextUtils.TextRange.TextRange | null;
    _spectrum: ColorPicker.Spectrum.Spectrum | null;
    _currentSwatch: Element | null;
    _boundHandleKeyDown: ((arg0: Event) => void) | null;
    constructor(textEditor: SourceFrame.SourcesTextEditor.SourcesTextEditor);
    static accepts(uiSourceCode: Workspace.UISourceCode.UISourceCode): boolean;
    _registerShortcuts(): void;
    _textEditorScrolled(): void;
    _modifyUnit(unit: string, change: number): string | null;
    _handleUnitModification(change: number): Promise<boolean>;
    _updateSwatches(startLine: number, endLine: number): void;
    _createColorSwatch(text: string): HTMLElement | null;
    _createBezierSwatch(text: string): InlineEditor.Swatches.BezierSwatch | null;
    _swatchIconClicked(swatch: Element, event: Event): void;
    _showSpectrum(swatch: InlineEditor.ColorSwatch.ColorSwatch): void;
    _spectrumResized(_event: Common.EventTarget.EventTargetEvent): void;
    _spectrumChanged(event: Common.EventTarget.EventTargetEvent): void;
    _showBezierEditor(swatch: InlineEditor.Swatches.BezierSwatch): void;
    _bezierChanged(event: Common.EventTarget.EventTargetEvent): void;
    _changeSwatchText(text: string): void;
    _swatchPopoverHidden(commitEdit: boolean): void;
    _onTextChanged(event: Common.EventTarget.EventTargetEvent): void;
    _isWordChar(char: string): boolean;
    _cssSuggestions(prefixRange: TextUtils.TextRange.TextRange, _substituteRange: TextUtils.TextRange.TextRange): Promise<UI.SuggestBox.Suggestions> | null;
    _backtrackPropertyToken(lineNumber: number, columnNumber: number): {
        startColumn: number;
        endColumn: number;
        type: string;
    } | null;
    dispose(): void;
}
export declare const maxSwatchProcessingLength: number;
export declare const SwatchBookmark: symbol;
