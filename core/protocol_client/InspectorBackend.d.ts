import type * as ProtocolProxyApi from '../../generated/protocol-proxy-api.js';
import * as Protocol from '../../generated/protocol.js';
export declare const DevToolsStubErrorCode = -32015;
declare type MessageParams = {
    [x: string]: any;
};
declare type ProtocolDomainName = ProtocolProxyApi.ProtocolDomainName;
export interface MessageError {
    code: number;
    message: string;
    data?: string | null;
}
export declare type Message = {
    sessionId?: string;
    url?: string;
    id?: number;
    error?: MessageError | null;
    result?: Object | null;
    method?: QualifiedName;
    params?: MessageParams | null;
};
interface EventMessage extends Message {
    method: QualifiedName;
    params?: MessageParams | null;
}
/** A qualified name, e.g. Domain.method */
export declare type QualifiedName = string & {
    qualifiedEventNameTag: string | undefined;
};
/** A qualified name, e.g. method */
export declare type UnqualifiedName = string & {
    unqualifiedEventNameTag: string | undefined;
};
export declare const splitQualifiedName: (string: QualifiedName) => [string, UnqualifiedName];
export declare const qualifyName: (domain: string, name: UnqualifiedName) => QualifiedName;
declare type EventParameterNames = Map<QualifiedName, string[]>;
declare type ReadonlyEventParameterNames = ReadonlyMap<QualifiedName, string[]>;
interface CommandParameter {
    name: string;
    type: string;
    optional: boolean;
}
declare type Callback = (error: MessageError | null, arg1: Object | null) => void;
interface CallbackWithDebugInfo {
    callback: Callback;
    method: string;
}
export declare class InspectorBackend {
    _agentPrototypes: Map<ProtocolDomainName, _AgentPrototype>;
    private initialized;
    private eventParameterNamesForDomain;
    private getOrCreateEventParameterNamesForDomain;
    getOrCreateEventParameterNamesForDomainForTesting(domain: ProtocolDomainName): EventParameterNames;
    getEventParamterNames(): ReadonlyMap<ProtocolDomainName, ReadonlyEventParameterNames>;
    static reportProtocolError(error: string, messageObject: Object): void;
    static reportProtocolWarning(error: string, messageObject: Object): void;
    isInitialized(): boolean;
    _agentPrototype(domain: ProtocolDomainName): _AgentPrototype;
    registerCommand(method: QualifiedName, parameters: CommandParameter[], replyArgs: string[]): void;
    registerEnum(type: QualifiedName, values: Object): void;
    registerEvent(eventName: QualifiedName, params: string[]): void;
}
export declare class Connection {
    _onMessage: ((arg0: Object) => void) | null;
    constructor();
    setOnMessage(_onMessage: (arg0: (Object | string)) => void): void;
    setOnDisconnect(_onDisconnect: (arg0: string) => void): void;
    sendRawMessage(_message: string): void;
    disconnect(): Promise<void>;
    static setFactory(factory: () => Connection): void;
    static getFactory(): () => Connection;
}
declare type SendRawMessageCallback = (...args: unknown[]) => void;
export declare const test: {
    /**
     * This will get called for every protocol message.
     * ProtocolClient.test.dumpProtocol = console.log
     */
    dumpProtocol: ((arg0: string) => void) | null;
    /**
     * Runs a function when no protocol activity is present.
     * ProtocolClient.test.deprecatedRunAfterPendingDispatches(() => console.log('done'))
     */
    deprecatedRunAfterPendingDispatches: ((arg0: () => void) => void) | null;
    /**
     * Sends a raw message over main connection.
     * ProtocolClient.test.sendRawMessage('Page.enable', {}, console.log)
     */
    sendRawMessage: ((method: QualifiedName, args: Object | null, arg2: SendRawMessageCallback) => void) | null;
    /**
     * Set to true to not log any errors.
     */
    suppressRequestErrors: boolean;
    /**
     * Set to get notified about any messages sent over protocol.
     */
    onMessageSent: ((message: {
        domain: string;
        method: string;
        params: Object;
        id: number;
        sessionId?: string;
    }, target: TargetBase | null) => void) | null;
    /**
     * Set to get notified about any messages received over protocol.
     */
    onMessageReceived: ((message: Object, target: TargetBase | null) => void) | null;
};
export declare class SessionRouter {
    _connection: Connection;
    connectionInternal: Connection;
    _lastMessageId: number;
    _pendingResponsesCount: number;
    _pendingLongPollingMessageIds: Set<number>;
    _sessions: Map<string, {
        target: TargetBase;
        callbacks: Map<number, CallbackWithDebugInfo>;
        proxyConnection: ((Connection | undefined) | null);
    }>;
    _pendingScripts: (() => void)[];
    constructor(connection: Connection);
    registerSession(target: TargetBase, sessionId: string, proxyConnection?: Connection | null): void;
    unregisterSession(sessionId: string): void;
    _getTargetBySessionId(sessionId: string): TargetBase | null;
    _nextMessageId(): number;
    connection(): Connection;
    sendMessage(sessionId: string, domain: string, method: QualifiedName, params: Object | null, callback: Callback): void;
    _sendRawMessageForTesting(method: QualifiedName, params: Object | null, callback: Callback | null): void;
    _onMessage(message: string | Object): void;
    _hasOutstandingNonLongPollingRequests(): boolean;
    _deprecatedRunAfterPendingDispatches(script?: (() => void)): void;
    _executeAfterPendingDispatches(): void;
    static dispatchConnectionError(callback: Callback, method: string): void;
    static dispatchUnregisterSessionError({ callback, method }: CallbackWithDebugInfo): void;
}
export declare class TargetBase {
    _needsNodeJSPatching: boolean;
    _sessionId: string;
    _router: SessionRouter | null;
    private agents;
    private dispatchers;
    constructor(needsNodeJSPatching: boolean, parentTarget: TargetBase | null, sessionId: string, connection: Connection | null);
    dispatch(eventMessage: EventMessage): void;
    dispose(_reason: string): void;
    isDisposed(): boolean;
    markAsNodeJSForTest(): void;
    router(): SessionRouter | null;
    /**
     * Make sure that `Domain` is only ever instantiated with one protocol domain
     * name, because if `Domain` allows multiple domains, the type is unsound.
     */
    private getAgent;
    accessibilityAgent(): ProtocolProxyApi.AccessibilityApi;
    animationAgent(): ProtocolProxyApi.AnimationApi;
    applicationCacheAgent(): ProtocolProxyApi.ApplicationCacheApi;
    auditsAgent(): ProtocolProxyApi.AuditsApi;
    browserAgent(): ProtocolProxyApi.BrowserApi;
    backgroundServiceAgent(): ProtocolProxyApi.BackgroundServiceApi;
    cacheStorageAgent(): ProtocolProxyApi.CacheStorageApi;
    cssAgent(): ProtocolProxyApi.CSSApi;
    databaseAgent(): ProtocolProxyApi.DatabaseApi;
    debuggerAgent(): ProtocolProxyApi.DebuggerApi;
    deviceOrientationAgent(): ProtocolProxyApi.DeviceOrientationApi;
    domAgent(): ProtocolProxyApi.DOMApi;
    domdebuggerAgent(): ProtocolProxyApi.DOMDebuggerApi;
    domsnapshotAgent(): ProtocolProxyApi.DOMSnapshotApi;
    domstorageAgent(): ProtocolProxyApi.DOMStorageApi;
    emulationAgent(): ProtocolProxyApi.EmulationApi;
    heapProfilerAgent(): ProtocolProxyApi.HeapProfilerApi;
    indexedDBAgent(): ProtocolProxyApi.IndexedDBApi;
    inputAgent(): ProtocolProxyApi.InputApi;
    ioAgent(): ProtocolProxyApi.IOApi;
    inspectorAgent(): ProtocolProxyApi.InspectorApi;
    layerTreeAgent(): ProtocolProxyApi.LayerTreeApi;
    logAgent(): ProtocolProxyApi.LogApi;
    mediaAgent(): ProtocolProxyApi.MediaApi;
    memoryAgent(): ProtocolProxyApi.MemoryApi;
    networkAgent(): ProtocolProxyApi.NetworkApi;
    overlayAgent(): ProtocolProxyApi.OverlayApi;
    pageAgent(): ProtocolProxyApi.PageApi;
    profilerAgent(): ProtocolProxyApi.ProfilerApi;
    performanceAgent(): ProtocolProxyApi.PerformanceApi;
    runtimeAgent(): ProtocolProxyApi.RuntimeApi;
    securityAgent(): ProtocolProxyApi.SecurityApi;
    serviceWorkerAgent(): ProtocolProxyApi.ServiceWorkerApi;
    storageAgent(): ProtocolProxyApi.StorageApi;
    targetAgent(): ProtocolProxyApi.TargetApi;
    tracingAgent(): ProtocolProxyApi.TracingApi;
    webAudioAgent(): ProtocolProxyApi.WebAudioApi;
    webAuthnAgent(): ProtocolProxyApi.WebAuthnApi;
    /**
     * Make sure that `Domain` is only ever instantiated with one protocol domain
     * name, because if `Domain` allows multiple domains, the type is unsound.
     */
    private registerDispatcher;
    /**
     * Make sure that `Domain` is only ever instantiated with one protocol domain
     * name, because if `Domain` allows multiple domains, the type is unsound.
     */
    private unregisterDispatcher;
    registerAnimationDispatcher(dispatcher: ProtocolProxyApi.AnimationDispatcher): void;
    registerApplicationCacheDispatcher(dispatcher: ProtocolProxyApi.ApplicationCacheDispatcher): void;
    registerAuditsDispatcher(dispatcher: ProtocolProxyApi.AuditsDispatcher): void;
    registerCSSDispatcher(dispatcher: ProtocolProxyApi.CSSDispatcher): void;
    registerDatabaseDispatcher(dispatcher: ProtocolProxyApi.DatabaseDispatcher): void;
    registerBackgroundServiceDispatcher(dispatcher: ProtocolProxyApi.BackgroundServiceDispatcher): void;
    registerDebuggerDispatcher(dispatcher: ProtocolProxyApi.DebuggerDispatcher): void;
    unregisterDebuggerDispatcher(dispatcher: ProtocolProxyApi.DebuggerDispatcher): void;
    registerDOMDispatcher(dispatcher: ProtocolProxyApi.DOMDispatcher): void;
    registerDOMStorageDispatcher(dispatcher: ProtocolProxyApi.DOMStorageDispatcher): void;
    registerHeapProfilerDispatcher(dispatcher: ProtocolProxyApi.HeapProfilerDispatcher): void;
    registerInspectorDispatcher(dispatcher: ProtocolProxyApi.InspectorDispatcher): void;
    registerLayerTreeDispatcher(dispatcher: ProtocolProxyApi.LayerTreeDispatcher): void;
    registerLogDispatcher(dispatcher: ProtocolProxyApi.LogDispatcher): void;
    registerMediaDispatcher(dispatcher: ProtocolProxyApi.MediaDispatcher): void;
    registerNetworkDispatcher(dispatcher: ProtocolProxyApi.NetworkDispatcher): void;
    registerOverlayDispatcher(dispatcher: ProtocolProxyApi.OverlayDispatcher): void;
    registerPageDispatcher(dispatcher: ProtocolProxyApi.PageDispatcher): void;
    registerProfilerDispatcher(dispatcher: ProtocolProxyApi.ProfilerDispatcher): void;
    registerRuntimeDispatcher(dispatcher: ProtocolProxyApi.RuntimeDispatcher): void;
    registerSecurityDispatcher(dispatcher: ProtocolProxyApi.SecurityDispatcher): void;
    registerServiceWorkerDispatcher(dispatcher: ProtocolProxyApi.ServiceWorkerDispatcher): void;
    registerStorageDispatcher(dispatcher: ProtocolProxyApi.StorageDispatcher): void;
    registerTargetDispatcher(dispatcher: ProtocolProxyApi.TargetDispatcher): void;
    registerTracingDispatcher(dispatcher: ProtocolProxyApi.TracingDispatcher): void;
    registerWebAudioDispatcher(dispatcher: ProtocolProxyApi.WebAudioDispatcher): void;
}
/**
 * This is a class that serves as the prototype for a domains agents (every target
 * has it's own set of agents). The InspectorBackend keeps an instance of this class
 * per domain, and each TargetBase creates its agents (via Object.create) and installs
 * this instance as prototype.
 *
 * The reasons this is done is so that on the prototypes we can install the implementations
 * of the invoke_enable, etc. methods that the front-end uses.
 */
declare class _AgentPrototype {
    _replyArgs: {
        [x: string]: string[];
    };
    _domain: string;
    _target: TargetBase;
    constructor(domain: string);
    registerCommand(methodName: UnqualifiedName, parameters: CommandParameter[], replyArgs: string[]): void;
    _prepareParameters(method: string, parameters: CommandParameter[], args: unknown[], errorCallback: (arg0: string) => void): Object | null;
    _sendMessageToBackendPromise(method: QualifiedName, parameters: CommandParameter[], args: unknown[]): Promise<unknown>;
    _invoke(method: QualifiedName, request: Object | null): Promise<Protocol.ProtocolResponseWithError>;
}
export declare const inspectorBackend: InspectorBackend;
export {};
