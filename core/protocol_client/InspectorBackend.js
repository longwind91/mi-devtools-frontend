/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/* eslint-disable rulesdir/no_underscored_properties */
import { NodeURL } from './NodeURL.js';
export const DevToolsStubErrorCode = -32015;
// TODO(dgozman): we are not reporting generic errors in tests, but we should
// instead report them and just have some expected errors in test expectations.
const GenericError = -32000;
const ConnectionClosedErrorCode = -32001;
export const splitQualifiedName = (string) => {
    const [domain, eventName] = string.split('.');
    return [domain, eventName];
};
export const qualifyName = (domain, name) => {
    return `${domain}.${name}`;
};
export class InspectorBackend {
    _agentPrototypes = new Map();
    initialized = false;
    eventParameterNamesForDomain = new Map();
    getOrCreateEventParameterNamesForDomain(domain) {
        let map = this.eventParameterNamesForDomain.get(domain);
        if (!map) {
            map = new Map();
            this.eventParameterNamesForDomain.set(domain, map);
        }
        return map;
    }
    getOrCreateEventParameterNamesForDomainForTesting(domain) {
        return this.getOrCreateEventParameterNamesForDomain(domain);
    }
    getEventParamterNames() {
        return this.eventParameterNamesForDomain;
    }
    static reportProtocolError(error, messageObject) {
        console.error(error + ': ' + JSON.stringify(messageObject));
    }
    static reportProtocolWarning(error, messageObject) {
        console.warn(error + ': ' + JSON.stringify(messageObject));
    }
    isInitialized() {
        return this.initialized;
    }
    _agentPrototype(domain) {
        let prototype = this._agentPrototypes.get(domain);
        if (!prototype) {
            prototype = new _AgentPrototype(domain);
            this._agentPrototypes.set(domain, prototype);
        }
        return prototype;
    }
    registerCommand(method, parameters, replyArgs) {
        const [domain, command] = splitQualifiedName(method);
        this._agentPrototype(domain).registerCommand(command, parameters, replyArgs);
        this.initialized = true;
    }
    registerEnum(type, values) {
        const [domain, name] = splitQualifiedName(type);
        // @ts-ignore Protocol global namespace pollution
        if (!Protocol[domain]) {
            // @ts-ignore Protocol global namespace pollution
            Protocol[domain] = {};
        }
        // @ts-ignore Protocol global namespace pollution
        Protocol[domain][name] = values;
        this.initialized = true;
    }
    registerEvent(eventName, params) {
        const domain = eventName.split('.')[0];
        const eventParameterNames = this.getOrCreateEventParameterNamesForDomain(domain);
        eventParameterNames.set(eventName, params);
        this.initialized = true;
    }
}
let connectionFactory;
export class Connection {
    _onMessage;
    constructor() {
    }
    setOnMessage(_onMessage) {
    }
    setOnDisconnect(_onDisconnect) {
    }
    sendRawMessage(_message) {
    }
    disconnect() {
        throw new Error('not implemented');
    }
    static setFactory(factory) {
        connectionFactory = factory;
    }
    static getFactory() {
        return connectionFactory;
    }
}
export const test = {
    /**
     * This will get called for every protocol message.
     * ProtocolClient.test.dumpProtocol = console.log
     */
    dumpProtocol: null,
    /**
     * Runs a function when no protocol activity is present.
     * ProtocolClient.test.deprecatedRunAfterPendingDispatches(() => console.log('done'))
     */
    deprecatedRunAfterPendingDispatches: null,
    /**
     * Sends a raw message over main connection.
     * ProtocolClient.test.sendRawMessage('Page.enable', {}, console.log)
     */
    sendRawMessage: null,
    /**
     * Set to true to not log any errors.
     */
    suppressRequestErrors: false,
    /**
     * Set to get notified about any messages sent over protocol.
     */
    onMessageSent: null,
    /**
     * Set to get notified about any messages received over protocol.
     */
    onMessageReceived: null,
};
const LongPollingMethods = new Set(['CSS.takeComputedStyleUpdates']);
const screenshotCDP = [
    'Emulation.setEmulatedMedia',
    'Page.startScreencast',
    'Emulation.setTouchEmulationEnabled',
    'Page.stopScreencast',
    'Emulation.setEmitTouchEventsForMouse',
    'Input.emulateTouchFromMouseEvent',
    'DOM.getNodeForLocation',
    'DOM.getBoxModel',
    'Page.screencastFrameAck',
];
export class SessionRouter {
    _connection;
    connectionInternal;
    _lastMessageId;
    _pendingResponsesCount;
    _pendingLongPollingMessageIds;
    _sessions;
    _pendingScripts;
    constructor(connection) {
        this._connection = connection;
        this.connectionInternal = connection;
        this._lastMessageId = 1;
        this._pendingResponsesCount = 0;
        this._pendingLongPollingMessageIds = new Set();
        this._sessions = new Map();
        this._pendingScripts = [];
        test.deprecatedRunAfterPendingDispatches = this._deprecatedRunAfterPendingDispatches.bind(this);
        test.sendRawMessage = this._sendRawMessageForTesting.bind(this);
        this._connection.setOnMessage(this._onMessage.bind(this));
        this._connection.setOnDisconnect(reason => {
            const session = this._sessions.get('');
            if (session) {
                session.target.dispose(reason);
            }
        });
    }
    registerSession(target, sessionId, proxyConnection) {
        // Only the Audits panel uses proxy connections. If it is ever possible to have multiple active at the
        // same time, it should be tested thoroughly.
        if (proxyConnection) {
            for (const session of this._sessions.values()) {
                if (session.proxyConnection) {
                    console.error('Multiple simultaneous proxy connections are currently unsupported');
                    break;
                }
            }
        }
        this._sessions.set(sessionId, { target, callbacks: new Map(), proxyConnection });
    }
    unregisterSession(sessionId) {
        const session = this._sessions.get(sessionId);
        if (!session) {
            return;
        }
        for (const callback of session.callbacks.values()) {
            SessionRouter.dispatchUnregisterSessionError(callback);
        }
        this._sessions.delete(sessionId);
    }
    _getTargetBySessionId(sessionId) {
        const session = this._sessions.get(sessionId ? sessionId : '');
        if (!session) {
            return null;
        }
        return session.target;
    }
    _nextMessageId() {
        return this._lastMessageId++;
    }
    connection() {
        return this._connection;
    }
    sendMessage(sessionId, domain, method, params, callback) {
        const messageId = this._nextMessageId();
        const messageObject = {
            id: messageId,
            method: method,
        };
        if (params) {
            messageObject.params = params;
        }
        if (sessionId) {
            messageObject.sessionId = sessionId;
        }
        if (test.dumpProtocol) {
            test.dumpProtocol('frontend: ' + JSON.stringify(messageObject));
        }
        if (test.onMessageSent) {
            const paramsObject = JSON.parse(JSON.stringify(params || {}));
            test.onMessageSent({ domain, method, params: paramsObject, id: messageId, sessionId }, this._getTargetBySessionId(sessionId));
        }
        ++this._pendingResponsesCount;
        if (LongPollingMethods.has(method)) {
            this._pendingLongPollingMessageIds.add(messageId);
        }
        const session = this._sessions.get(sessionId);
        if (!session) {
            return;
        }
        session.callbacks.set(messageId, { callback, method });
        this._connection.sendRawMessage(JSON.stringify(messageObject));
    }
    _sendRawMessageForTesting(method, params, callback) {
        const domain = method.split('.')[0];
        this.sendMessage('', domain, method, params, callback || (() => { }));
    }
    _onMessage(message) {
        if (test.dumpProtocol) {
            test.dumpProtocol('backend: ' + ((typeof message === 'string') ? message : JSON.stringify(message)));
        }
        if (test.onMessageReceived) {
            const messageObjectCopy = JSON.parse((typeof message === 'string') ? message : JSON.stringify(message));
            test.onMessageReceived(messageObjectCopy, this._getTargetBySessionId(messageObjectCopy.sessionId));
        }
        const messageObject = ((typeof message === 'string') ? JSON.parse(message) : message);
        if (messageObject?.method
            && screenshotCDP.indexOf(messageObject?.method || 'neverUseString') > -1) {
            this.sendMessage('', messageObject?.method.split('.')[0], messageObject?.method, messageObject?.params, () => { });
            return;
        }
        // Send all messages to proxy connections.
        let suppressUnknownMessageErrors = false;
        for (const session of this._sessions.values()) {
            if (!session.proxyConnection) {
                continue;
            }
            if (!session.proxyConnection._onMessage) {
                InspectorBackend.reportProtocolError('Protocol Error: the session has a proxyConnection with no _onMessage', messageObject);
                continue;
            }
            session.proxyConnection._onMessage(messageObject);
            suppressUnknownMessageErrors = true;
        }
        const sessionId = messageObject.sessionId || '';
        const session = this._sessions.get(sessionId);
        if (!session) {
            if (!suppressUnknownMessageErrors) {
                InspectorBackend.reportProtocolError('Protocol Error: the message with wrong session id', messageObject);
            }
            return;
        }
        // If this message is directly for the target controlled by the proxy connection, don't handle it.
        if (session.proxyConnection) {
            return;
        }
        if (session.target._needsNodeJSPatching) {
            NodeURL.patch(messageObject);
        }
        if (messageObject.id !== undefined) { // just a response for some request
            const callback = session.callbacks.get(messageObject.id);
            session.callbacks.delete(messageObject.id);
            if (!callback) {
                if (!suppressUnknownMessageErrors) {
                    InspectorBackend.reportProtocolError('Protocol Error: the message with wrong id', messageObject);
                }
                return;
            }
            callback.callback(messageObject.error || null, messageObject.result || null);
            --this._pendingResponsesCount;
            this._pendingLongPollingMessageIds.delete(messageObject.id);
            if (this._pendingScripts.length && !this._hasOutstandingNonLongPollingRequests()) {
                this._deprecatedRunAfterPendingDispatches();
            }
        }
        else {
            if (messageObject.method === undefined) {
                InspectorBackend.reportProtocolError('Protocol Error: the message without method', messageObject);
                return;
            }
            // This cast is justified as we just checked for the presence of messageObject.method.
            const eventMessage = messageObject;
            session.target.dispatch(eventMessage);
        }
    }
    _hasOutstandingNonLongPollingRequests() {
        return this._pendingResponsesCount - this._pendingLongPollingMessageIds.size > 0;
    }
    _deprecatedRunAfterPendingDispatches(script) {
        if (script) {
            this._pendingScripts.push(script);
        }
        // Execute all promises.
        setTimeout(() => {
            if (!this._hasOutstandingNonLongPollingRequests()) {
                this._executeAfterPendingDispatches();
            }
            else {
                this._deprecatedRunAfterPendingDispatches();
            }
        }, 0);
    }
    _executeAfterPendingDispatches() {
        if (!this._hasOutstandingNonLongPollingRequests()) {
            const scripts = this._pendingScripts;
            this._pendingScripts = [];
            for (let id = 0; id < scripts.length; ++id) {
                scripts[id]();
            }
        }
    }
    static dispatchConnectionError(callback, method) {
        const error = {
            message: `Connection is closed, can\'t dispatch pending call to ${method}`,
            code: ConnectionClosedErrorCode,
            data: null,
        };
        setTimeout(() => callback(error, null), 0);
    }
    static dispatchUnregisterSessionError({ callback, method }) {
        const error = {
            message: `Session is unregistering, can\'t dispatch pending call to ${method}`,
            code: ConnectionClosedErrorCode,
            data: null,
        };
        setTimeout(() => callback(error, null), 0);
    }
}
export class TargetBase {
    _needsNodeJSPatching;
    _sessionId;
    _router;
    agents = new Map();
    dispatchers = new Map();
    constructor(needsNodeJSPatching, parentTarget, sessionId, connection) {
        this._needsNodeJSPatching = needsNodeJSPatching;
        this._sessionId = sessionId;
        if ((!parentTarget && connection) || (!parentTarget && sessionId) || (connection && sessionId)) {
            throw new Error('Either connection or sessionId (but not both) must be supplied for a child target');
        }
        let router;
        if (sessionId && parentTarget && parentTarget._router) {
            router = parentTarget._router;
        }
        else if (connection) {
            router = new SessionRouter(connection);
        }
        else {
            router = new SessionRouter(connectionFactory());
        }
        this._router = router;
        router.registerSession(this, this._sessionId);
        for (const [domain, agentPrototype] of inspectorBackend._agentPrototypes) {
            const agent = Object.create(agentPrototype);
            agent._target = this;
            this.agents.set(domain, agent);
        }
        for (const [domain, eventParameterNames] of inspectorBackend.getEventParamterNames().entries()) {
            this.dispatchers.set(domain, new DispatcherManager(eventParameterNames));
        }
    }
    dispatch(eventMessage) {
        const [domainName, method] = splitQualifiedName(eventMessage.method);
        const dispatcher = this.dispatchers.get(domainName);
        if (!dispatcher) {
            InspectorBackend.reportProtocolError(`Protocol Error: the message ${eventMessage.method} is for non-existing domain '${domainName}'`, eventMessage);
            return;
        }
        dispatcher.dispatch(method, eventMessage);
    }
    dispose(_reason) {
        if (!this._router) {
            return;
        }
        this._router.unregisterSession(this._sessionId);
        this._router = null;
    }
    isDisposed() {
        return !this._router;
    }
    markAsNodeJSForTest() {
        this._needsNodeJSPatching = true;
    }
    router() {
        return this._router;
    }
    // Agent accessors, keep alphabetically sorted.
    /**
     * Make sure that `Domain` is only ever instantiated with one protocol domain
     * name, because if `Domain` allows multiple domains, the type is unsound.
     */
    getAgent(domain) {
        const agent = this.agents.get(domain);
        if (!agent) {
            throw new Error('Accessing undefined agent');
        }
        return agent;
    }
    accessibilityAgent() {
        return this.getAgent('Accessibility');
    }
    animationAgent() {
        return this.getAgent('Animation');
    }
    applicationCacheAgent() {
        return this.getAgent('ApplicationCache');
    }
    auditsAgent() {
        return this.getAgent('Audits');
    }
    browserAgent() {
        return this.getAgent('Browser');
    }
    backgroundServiceAgent() {
        return this.getAgent('BackgroundService');
    }
    cacheStorageAgent() {
        return this.getAgent('CacheStorage');
    }
    cssAgent() {
        return this.getAgent('CSS');
    }
    databaseAgent() {
        return this.getAgent('Database');
    }
    debuggerAgent() {
        return this.getAgent('Debugger');
    }
    deviceOrientationAgent() {
        return this.getAgent('DeviceOrientation');
    }
    domAgent() {
        return this.getAgent('DOM');
    }
    domdebuggerAgent() {
        return this.getAgent('DOMDebugger');
    }
    domsnapshotAgent() {
        return this.getAgent('DOMSnapshot');
    }
    domstorageAgent() {
        return this.getAgent('DOMStorage');
    }
    emulationAgent() {
        return this.getAgent('Emulation');
    }
    heapProfilerAgent() {
        return this.getAgent('HeapProfiler');
    }
    indexedDBAgent() {
        return this.getAgent('IndexedDB');
    }
    inputAgent() {
        return this.getAgent('Input');
    }
    ioAgent() {
        return this.getAgent('IO');
    }
    inspectorAgent() {
        return this.getAgent('Inspector');
    }
    layerTreeAgent() {
        return this.getAgent('LayerTree');
    }
    logAgent() {
        return this.getAgent('Log');
    }
    mediaAgent() {
        return this.getAgent('Media');
    }
    memoryAgent() {
        return this.getAgent('Memory');
    }
    networkAgent() {
        return this.getAgent('Network');
    }
    overlayAgent() {
        return this.getAgent('Overlay');
    }
    pageAgent() {
        return this.getAgent('Page');
    }
    profilerAgent() {
        return this.getAgent('Profiler');
    }
    performanceAgent() {
        return this.getAgent('Performance');
    }
    runtimeAgent() {
        return this.getAgent('Runtime');
    }
    securityAgent() {
        return this.getAgent('Security');
    }
    serviceWorkerAgent() {
        return this.getAgent('ServiceWorker');
    }
    storageAgent() {
        return this.getAgent('Storage');
    }
    targetAgent() {
        return this.getAgent('Target');
    }
    tracingAgent() {
        return this.getAgent('Tracing');
    }
    webAudioAgent() {
        return this.getAgent('WebAudio');
    }
    webAuthnAgent() {
        return this.getAgent('WebAuthn');
    }
    // Dispatcher registration and de-registration, keep alphabetically sorted.
    /**
     * Make sure that `Domain` is only ever instantiated with one protocol domain
     * name, because if `Domain` allows multiple domains, the type is unsound.
     */
    registerDispatcher(domain, dispatcher) {
        const manager = this.dispatchers.get(domain);
        if (!manager) {
            return;
        }
        manager.addDomainDispatcher(dispatcher);
    }
    /**
     * Make sure that `Domain` is only ever instantiated with one protocol domain
     * name, because if `Domain` allows multiple domains, the type is unsound.
     */
    unregisterDispatcher(domain, dispatcher) {
        const manager = this.dispatchers.get(domain);
        if (!manager) {
            return;
        }
        manager.removeDomainDispatcher(dispatcher);
    }
    registerAnimationDispatcher(dispatcher) {
        this.registerDispatcher('Animation', dispatcher);
    }
    registerApplicationCacheDispatcher(dispatcher) {
        this.registerDispatcher('ApplicationCache', dispatcher);
    }
    registerAuditsDispatcher(dispatcher) {
        this.registerDispatcher('Audits', dispatcher);
    }
    registerCSSDispatcher(dispatcher) {
        this.registerDispatcher('CSS', dispatcher);
    }
    registerDatabaseDispatcher(dispatcher) {
        this.registerDispatcher('Database', dispatcher);
    }
    registerBackgroundServiceDispatcher(dispatcher) {
        this.registerDispatcher('BackgroundService', dispatcher);
    }
    registerDebuggerDispatcher(dispatcher) {
        this.registerDispatcher('Debugger', dispatcher);
    }
    unregisterDebuggerDispatcher(dispatcher) {
        this.unregisterDispatcher('Debugger', dispatcher);
    }
    registerDOMDispatcher(dispatcher) {
        this.registerDispatcher('DOM', dispatcher);
    }
    registerDOMStorageDispatcher(dispatcher) {
        this.registerDispatcher('DOMStorage', dispatcher);
    }
    registerHeapProfilerDispatcher(dispatcher) {
        this.registerDispatcher('HeapProfiler', dispatcher);
    }
    registerInspectorDispatcher(dispatcher) {
        this.registerDispatcher('Inspector', dispatcher);
    }
    registerLayerTreeDispatcher(dispatcher) {
        this.registerDispatcher('LayerTree', dispatcher);
    }
    registerLogDispatcher(dispatcher) {
        this.registerDispatcher('Log', dispatcher);
    }
    registerMediaDispatcher(dispatcher) {
        this.registerDispatcher('Media', dispatcher);
    }
    registerNetworkDispatcher(dispatcher) {
        this.registerDispatcher('Network', dispatcher);
    }
    registerOverlayDispatcher(dispatcher) {
        this.registerDispatcher('Overlay', dispatcher);
    }
    registerPageDispatcher(dispatcher) {
        this.registerDispatcher('Page', dispatcher);
    }
    registerProfilerDispatcher(dispatcher) {
        this.registerDispatcher('Profiler', dispatcher);
    }
    registerRuntimeDispatcher(dispatcher) {
        this.registerDispatcher('Runtime', dispatcher);
    }
    registerSecurityDispatcher(dispatcher) {
        this.registerDispatcher('Security', dispatcher);
    }
    registerServiceWorkerDispatcher(dispatcher) {
        this.registerDispatcher('ServiceWorker', dispatcher);
    }
    registerStorageDispatcher(dispatcher) {
        this.registerDispatcher('Storage', dispatcher);
    }
    registerTargetDispatcher(dispatcher) {
        this.registerDispatcher('Target', dispatcher);
    }
    registerTracingDispatcher(dispatcher) {
        this.registerDispatcher('Tracing', dispatcher);
    }
    registerWebAudioDispatcher(dispatcher) {
        this.registerDispatcher('WebAudio', dispatcher);
    }
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
// TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
// eslint-disable-next-line @typescript-eslint/naming-convention
class _AgentPrototype {
    _replyArgs;
    _domain;
    _target;
    constructor(domain) {
        this._replyArgs = {};
        this._domain = domain;
    }
    registerCommand(methodName, parameters, replyArgs) {
        const domainAndMethod = qualifyName(this._domain, methodName);
        function sendMessagePromise(...args) {
            return _AgentPrototype.prototype._sendMessageToBackendPromise.call(this, domainAndMethod, parameters, args);
        }
        // @ts-ignore Method code generation
        this[methodName] = sendMessagePromise;
        function invoke(request = {}) {
            return this._invoke(domainAndMethod, request);
        }
        // @ts-ignore Method code generation
        this['invoke_' + methodName] = invoke;
        this._replyArgs[domainAndMethod] = replyArgs;
    }
    _prepareParameters(method, parameters, args, errorCallback) {
        const params = {};
        let hasParams = false;
        for (const param of parameters) {
            const paramName = param.name;
            const typeName = param.type;
            const optionalFlag = param.optional;
            if (!args.length && !optionalFlag) {
                errorCallback(`Protocol Error: Invalid number of arguments for method '${method}' call. ` +
                    `It must have the following arguments ${JSON.stringify(parameters)}'.`);
                return null;
            }
            const value = args.shift();
            if (optionalFlag && typeof value === 'undefined') {
                continue;
            }
            if (typeof value !== typeName) {
                errorCallback(`Protocol Error: Invalid type of argument '${paramName}' for method '${method}' call. ` +
                    `It must be '${typeName}' but it is '${typeof value}'.`);
                return null;
            }
            params[paramName] = value;
            hasParams = true;
        }
        if (args.length) {
            errorCallback(`Protocol Error: Extra ${args.length} arguments in a call to method '${method}'.`);
            return null;
        }
        return hasParams ? params : null;
    }
    _sendMessageToBackendPromise(method, parameters, args) {
        let errorMessage;
        function onError(message) {
            console.error(message);
            errorMessage = message;
        }
        const params = this._prepareParameters(method, parameters, args, onError);
        if (errorMessage) {
            return Promise.resolve(null);
        }
        return new Promise(resolve => {
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const callback = (error, result) => {
                if (error) {
                    if (!test.suppressRequestErrors && error.code !== DevToolsStubErrorCode && error.code !== GenericError &&
                        error.code !== ConnectionClosedErrorCode) {
                        console.error('Request ' + method + ' failed. ' + JSON.stringify(error));
                    }
                    resolve(null);
                    return;
                }
                const args = this._replyArgs[method];
                resolve(result && args.length ? result[args[0]] : undefined);
            };
            if (!this._target._router) {
                SessionRouter.dispatchConnectionError(callback, method);
            }
            else {
                this._target._router.sendMessage(this._target._sessionId, this._domain, method, params, callback);
            }
        });
    }
    _invoke(method, request) {
        return new Promise(fulfill => {
            const callback = (error, result) => {
                if (error && !test.suppressRequestErrors && error.code !== DevToolsStubErrorCode &&
                    error.code !== GenericError && error.code !== ConnectionClosedErrorCode) {
                    console.error('Request ' + method + ' failed. ' + JSON.stringify(error));
                }
                const errorMessage = error?.message;
                fulfill({ ...result, getError: () => errorMessage });
            };
            if (!this._target._router) {
                SessionRouter.dispatchConnectionError(callback, method);
            }
            else {
                this._target._router.sendMessage(this._target._sessionId, this._domain, method, request, callback);
            }
        });
    }
}
/**
 * A `DispatcherManager` has a collection of dispatchers that implement one of the
 * `ProtocolProxyApi.{Foo}Dispatcher` interfaces. Each target uses one of these per
 * domain to manage the registered dispatchers. The class knows the parameter names
 * of the events via `eventArgs`, which is a map managed by the inspector back-end
 * so that there is only one map per domain that is shared among all DispatcherManagers.
 */
class DispatcherManager {
    eventArgs;
    dispatchers = [];
    constructor(eventArgs) {
        this.eventArgs = eventArgs;
    }
    addDomainDispatcher(dispatcher) {
        this.dispatchers.push(dispatcher);
    }
    removeDomainDispatcher(dispatcher) {
        const index = this.dispatchers.indexOf(dispatcher);
        if (index === -1) {
            return;
        }
        this.dispatchers.splice(index, 1);
    }
    dispatch(event, messageObject) {
        if (!this.dispatchers.length) {
            return;
        }
        if (!this.eventArgs.has(messageObject.method)) {
            InspectorBackend.reportProtocolWarning(`Protocol Warning: Attempted to dispatch an unspecified event '${messageObject.method}'`, messageObject);
            return;
        }
        const messageParams = { ...messageObject.params };
        for (let index = 0; index < this.dispatchers.length; ++index) {
            const dispatcher = this.dispatchers[index];
            if (event in dispatcher) {
                const f = dispatcher[event];
                // @ts-ignore Can't type check the dispatch.
                f.call(dispatcher, messageParams);
            }
        }
    }
}
export const inspectorBackend = new InspectorBackend();
//# sourceMappingURL=InspectorBackend.js.map