import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Common from '../common/common.js';
import type * as Protocol from '../../generated/protocol.js';
import type { NetworkRequest } from './NetworkRequest.js';
import type { ResourceTreeFrame, ResourceTreeModel } from './ResourceTreeModel.js';
export declare class Resource implements TextUtils.ContentProvider.ContentProvider {
    _resourceTreeModel: ResourceTreeModel;
    _request: NetworkRequest | null;
    _url: string;
    _documentURL: string;
    _frameId: string;
    _loaderId: string;
    _type: Common.ResourceType.ResourceType;
    _mimeType: string;
    _isGenerated: boolean;
    _lastModified: Date | null;
    _contentSize: number | null;
    _content: string | null;
    _contentLoadError: string | null;
    _contentEncoded: boolean;
    _pendingContentCallbacks: ((arg0: Object | null) => void)[];
    _parsedURL?: Common.ParsedURL.ParsedURL;
    _contentRequested?: boolean;
    constructor(resourceTreeModel: ResourceTreeModel, request: NetworkRequest | null, url: string, documentURL: string, frameId: string, loaderId: string, type: Common.ResourceType.ResourceType, mimeType: string, lastModified: Date | null, contentSize: number | null);
    lastModified(): Date | null;
    contentSize(): number | null;
    get request(): NetworkRequest | null;
    get url(): string;
    set url(x: string);
    get parsedURL(): Common.ParsedURL.ParsedURL | undefined;
    get documentURL(): string;
    get frameId(): Protocol.Page.FrameId;
    get loaderId(): Protocol.Network.LoaderId;
    get displayName(): string;
    resourceType(): Common.ResourceType.ResourceType;
    get mimeType(): string;
    get content(): string | null;
    get isGenerated(): boolean;
    set isGenerated(val: boolean);
    contentURL(): string;
    contentType(): Common.ResourceType.ResourceType;
    contentEncoded(): Promise<boolean>;
    requestContent(): Promise<TextUtils.ContentProvider.DeferredContent>;
    canonicalMimeType(): string;
    searchInContent(query: string, caseSensitive: boolean, isRegex: boolean): Promise<TextUtils.ContentProvider.SearchMatch[]>;
    populateImageSource(image: HTMLImageElement): Promise<void>;
    _requestFinished(): void;
    _innerRequestContent(): Promise<void>;
    hasTextContent(): boolean;
    frame(): ResourceTreeFrame | null;
    statusCode(): number;
}
