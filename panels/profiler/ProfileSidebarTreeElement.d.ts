import type * as Common from '../../core/common/common.js';
import * as UI from '../../ui/legacy/legacy.js';
import type { DataDisplayDelegate, ProfileHeader } from './ProfileHeader.js';
export declare function setSharedFileSelectorElement(element: HTMLInputElement): void;
export declare class ProfileSidebarTreeElement extends UI.TreeOutline.TreeElement {
    _iconElement: HTMLDivElement;
    _titlesElement: HTMLDivElement;
    _titleContainer: HTMLElement;
    titleElement: HTMLElement;
    _subtitleElement: HTMLElement;
    _className: string;
    _small: boolean;
    _dataDisplayDelegate: DataDisplayDelegate;
    profile: ProfileHeader;
    _saveLinkElement?: HTMLElement;
    _editing?: UI.InplaceEditor.Controller | null;
    constructor(dataDisplayDelegate: DataDisplayDelegate, profile: ProfileHeader, className: string);
    _createSaveLink(): void;
    _onProfileReceived(_event: Common.EventTarget.EventTargetEvent): void;
    _updateStatus(event: Common.EventTarget.EventTargetEvent): void;
    ondblclick(event: Event): boolean;
    _startEditing(eventTarget: Element): void;
    _editingCommitted(container: Element, newTitle: string): void;
    _editingCancelled(): void;
    dispose(): void;
    onselect(): boolean;
    ondelete(): boolean;
    onattach(): void;
    _handleContextMenuEvent(event: Event): void;
    _saveProfile(_event: Event): void;
    setSmall(small: boolean): void;
    setMainTitle(title: string): void;
}
