import type * as Common from '../../core/common/common.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import type * as Protocol from '../../generated/protocol.js';
import { AudioContextSelector } from './AudioContextSelector.js';
import { GraphManager } from './graph_visualizer/GraphManager.js';
import { WebAudioModel } from './WebAudioModel.js';
export declare class WebAudioView extends UI.ThrottledWidget.ThrottledWidget implements SDK.TargetManager.SDKModelObserver<WebAudioModel> {
    _contextSelector: AudioContextSelector;
    _contentContainer: HTMLElement;
    _detailViewContainer: HTMLElement;
    _graphManager: GraphManager;
    _landingPage: UI.Widget.VBox;
    _summaryBarContainer: HTMLElement;
    constructor();
    static instance(opts?: {
        forceNew: null;
    }): WebAudioView;
    wasShown(): void;
    willHide(): void;
    modelAdded(webAudioModel: WebAudioModel): void;
    modelRemoved(webAudioModel: WebAudioModel): void;
    doUpdate(): Promise<void>;
    _addEventListeners(webAudioModel: WebAudioModel): void;
    _removeEventListeners(webAudioModel: WebAudioModel): void;
    _contextCreated(event: Common.EventTarget.EventTargetEvent): void;
    _contextDestroyed(event: Common.EventTarget.EventTargetEvent): void;
    _contextChanged(event: Common.EventTarget.EventTargetEvent): void;
    _reset(): void;
    _suspendModel(): void;
    _audioListenerCreated(event: Common.EventTarget.EventTargetEvent): void;
    _audioListenerWillBeDestroyed(event: Common.EventTarget.EventTargetEvent): void;
    _audioNodeCreated(event: Common.EventTarget.EventTargetEvent): void;
    _audioNodeWillBeDestroyed(event: Common.EventTarget.EventTargetEvent): void;
    _audioParamCreated(event: Common.EventTarget.EventTargetEvent): void;
    _audioParamWillBeDestroyed(event: Common.EventTarget.EventTargetEvent): void;
    _nodesConnected(event: Common.EventTarget.EventTargetEvent): void;
    _nodesDisconnected(event: Common.EventTarget.EventTargetEvent): void;
    _nodeParamConnected(event: Common.EventTarget.EventTargetEvent): void;
    _nodeParamDisconnected(event: Common.EventTarget.EventTargetEvent): void;
    _updateDetailView(context: Protocol.WebAudio.BaseAudioContext): void;
    _updateSummaryBar(contextId: string, contextRealtimeData: Protocol.WebAudio.ContextRealtimeData): void;
    _clearSummaryBar(): void;
    _pollRealtimeData(): Promise<void>;
}
