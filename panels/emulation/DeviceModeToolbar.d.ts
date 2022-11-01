import * as Common from '../../core/common/common.js';
import * as UI from '../../ui/legacy/legacy.js';
import { DeviceModeModel, Type } from './DeviceModeModel.js';
import type { Mode } from './EmulatedDevices.js';
import { EmulatedDevice, EmulatedDevicesList } from './EmulatedDevices.js';
export declare class DeviceModeToolbar {
    _model: DeviceModeModel;
    _showMediaInspectorSetting: Common.Settings.Setting<boolean>;
    _showRulersSetting: Common.Settings.Setting<boolean>;
    _experimentDualScreenSupport: boolean;
    _deviceOutlineSetting: Common.Settings.Setting<boolean>;
    _showDeviceScaleFactorSetting: Common.Settings.Setting<boolean>;
    _showUserAgentTypeSetting: Common.Settings.Setting<boolean>;
    _autoAdjustScaleSetting: Common.Settings.Setting<boolean>;
    _lastMode: Map<EmulatedDevice, Mode>;
    _element: HTMLDivElement;
    _emulatedDevicesList: EmulatedDevicesList;
    _persistenceSetting: Common.Settings.Setting<{
        device: string;
        orientation: string;
        mode: string;
    }>;
    _spanButton: UI.Toolbar.ToolbarButton;
    _modeButton: UI.Toolbar.ToolbarButton;
    _widthInput: HTMLInputElement;
    _heightInput: HTMLInputElement;
    _deviceScaleItem: UI.Toolbar.ToolbarMenuButton;
    _deviceSelectItem: UI.Toolbar.ToolbarMenuButton;
    _scaleItem: UI.Toolbar.ToolbarMenuButton;
    _uaItem: UI.Toolbar.ToolbarMenuButton;
    _experimentalButton: UI.Toolbar.ToolbarToggle | null;
    _cachedDeviceScale: number | null;
    _cachedUaType: string | null;
    _updateWidthInput: (arg0: string) => void;
    _widthItem?: UI.Toolbar.ToolbarItem;
    _xItem?: UI.Toolbar.ToolbarItem;
    _updateHeightInput?: ((arg0: string) => void);
    _heightItem?: UI.Toolbar.ToolbarItem;
    _throttlingConditionsItem?: UI.Toolbar.ToolbarMenuButton;
    _cachedModelType?: Type;
    _cachedScale?: number;
    _cachedModelDevice?: EmulatedDevice | null;
    _cachedModelMode?: Mode | null;
    constructor(model: DeviceModeModel, showMediaInspectorSetting: Common.Settings.Setting<boolean>, showRulersSetting: Common.Settings.Setting<boolean>);
    _recordDeviceChange(device: EmulatedDevice, oldDevice: EmulatedDevice | null): void;
    _createEmptyToolbarElement(): Element;
    _fillLeftToolbar(toolbar: UI.Toolbar.Toolbar): void;
    _fillMainToolbar(toolbar: UI.Toolbar.Toolbar): void;
    _applyWidth(value: string): void;
    _applyHeight(value: string): void;
    _fillRightToolbar(toolbar: UI.Toolbar.Toolbar): void;
    _fillModeToolbar(toolbar: UI.Toolbar.Toolbar): void;
    _createExperimentalButton(toolbar: UI.Toolbar.Toolbar): void;
    _experimentalClicked(): void;
    _fillOptionsToolbar(toolbar: UI.Toolbar.Toolbar): void;
    _appendScaleMenuItems(contextMenu: UI.ContextMenu.ContextMenu): void;
    _onScaleMenuChanged(value: number): void;
    _onAutoAdjustScaleChanged(): void;
    _appendDeviceScaleMenuItems(contextMenu: UI.ContextMenu.ContextMenu): void;
    _appendUserAgentMenuItems(contextMenu: UI.ContextMenu.ContextMenu): void;
    _appendOptionsMenuItems(contextMenu: UI.ContextMenu.ContextMenu): void;
    _reset(): void;
    _wrapToolbarItem(element: Element): UI.Toolbar.ToolbarItem;
    _emulateDevice(device: EmulatedDevice): void;
    _switchToResponsive(): void;
    _filterDevices(devices: EmulatedDevice[]): EmulatedDevice[];
    _standardDevices(): EmulatedDevice[];
    _customDevices(): EmulatedDevice[];
    _allDevices(): EmulatedDevice[];
    _appendDeviceMenuItems(contextMenu: UI.ContextMenu.ContextMenu): void;
    _deviceListChanged(this: DeviceModeToolbar): void;
    _updateDeviceScaleFactorVisibility(): void;
    _updateUserAgentTypeVisibility(): void;
    _spanClicked(): void;
    _modeMenuClicked(event: {
        data: Event;
    }): void;
    _getPrettyZoomPercentage(): string;
    element(): Element;
    update(): void;
    restore(): void;
}
