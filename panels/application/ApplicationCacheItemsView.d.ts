import type * as Common from '../../core/common/common.js';
import * as DataGrid from '../../ui/legacy/components/data_grid/data_grid.js';
import * as UI from '../../ui/legacy/legacy.js';
import type * as Protocol from '../../generated/protocol.js';
import type { ApplicationCacheModel } from './ApplicationCacheModel.js';
export declare class ApplicationCacheItemsView extends UI.View.SimpleView {
    _model: ApplicationCacheModel;
    _deleteButton: UI.Toolbar.ToolbarButton;
    _connectivityIcon: UI.UIUtils.DevToolsIconLabel;
    _statusIcon: UI.UIUtils.DevToolsIconLabel;
    _frameId: string;
    _emptyWidget: UI.EmptyWidget.EmptyWidget;
    _nodeResources: WeakMap<DataGrid.DataGrid.DataGridNode<unknown>, Protocol.ApplicationCache.ApplicationCacheResource>;
    _viewDirty?: boolean;
    _status?: number;
    _manifest?: string;
    _creationTime?: number;
    _updateTime?: number;
    _size?: number;
    _resources?: Protocol.ApplicationCache.ApplicationCacheResource[];
    _dataGrid?: DataGrid.DataGrid.DataGridImpl<unknown>;
    constructor(model: ApplicationCacheModel, frameId: string);
    toolbarItems(): Promise<UI.Toolbar.ToolbarItem[]>;
    wasShown(): void;
    willHide(): void;
    _maybeUpdate(): void;
    _markDirty(): void;
    updateStatus(status: number): void;
    updateNetworkState(isNowOnline: boolean): void;
    _update(): Promise<void>;
    _createDataGrid(): void;
    _populateDataGrid(): void;
    _deleteButtonClicked(_event: Common.EventTarget.EventTargetEvent): void;
    _deleteCallback(_node: DataGrid.DataGrid.DataGridNode<unknown>): void;
}