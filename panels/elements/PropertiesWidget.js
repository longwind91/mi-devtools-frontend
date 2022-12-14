// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Host from '../../core/host/host.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as ObjectUI from '../../ui/legacy/components/object_ui/object_ui.js';
import * as UI from '../../ui/legacy/legacy.js';
const OBJECT_GROUP_NAME = 'properties-sidebar-pane';
let propertiesWidgetInstance;
export class PropertiesWidget extends UI.ThrottledWidget.ThrottledWidget {
    _node;
    _treeOutline;
    _expandController;
    _lastRequestedNode;
    constructor() {
        super(true /* isWebComponent */);
        this.registerRequiredCSS('panels/elements/propertiesWidget.css');
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMModel.DOMModel, SDK.DOMModel.Events.AttrModified, this._onNodeChange, this);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMModel.DOMModel, SDK.DOMModel.Events.AttrRemoved, this._onNodeChange, this);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMModel.DOMModel, SDK.DOMModel.Events.CharacterDataModified, this._onNodeChange, this);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMModel.DOMModel, SDK.DOMModel.Events.ChildNodeCountUpdated, this._onNodeChange, this);
        UI.Context.Context.instance().addFlavorChangeListener(SDK.DOMModel.DOMNode, this._setNode, this);
        this._node = UI.Context.Context.instance().flavor(SDK.DOMModel.DOMNode);
        this._treeOutline = new ObjectUI.ObjectPropertiesSection.ObjectPropertiesSectionsTreeOutline({ readOnly: true });
        this._treeOutline.setShowSelectionOnKeyboardFocus(/* show */ true, /* preventTabOrder */ false);
        this._expandController =
            new ObjectUI.ObjectPropertiesSection.ObjectPropertiesSectionsTreeExpandController(this._treeOutline);
        this.contentElement.appendChild(this._treeOutline.element);
        this._treeOutline.addEventListener(UI.TreeOutline.Events.ElementExpanded, () => {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.DOMPropertiesExpanded);
        });
        this.update();
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!propertiesWidgetInstance || forceNew) {
            propertiesWidgetInstance = new PropertiesWidget();
        }
        return propertiesWidgetInstance;
    }
    _setNode(event) {
        this._node = event.data;
        this.update();
    }
    async doUpdate() {
        if (this._lastRequestedNode) {
            this._lastRequestedNode.domModel().runtimeModel().releaseObjectGroup(OBJECT_GROUP_NAME);
            delete this._lastRequestedNode;
        }
        if (!this._node) {
            this._treeOutline.removeChildren();
            return;
        }
        this._lastRequestedNode = this._node;
        const object = await this._node.resolveToObject(OBJECT_GROUP_NAME);
        if (!object) {
            return;
        }
        const result = await object.callFunction(protoList);
        if (!result.object || result.wasThrown) {
            return;
        }
        const propertiesResult = await result.object.getOwnProperties(false /* generatePreview */);
        result.object.release();
        if (!propertiesResult || !propertiesResult.properties) {
            return;
        }
        const properties = propertiesResult.properties;
        this._treeOutline.removeChildren();
        let selected = false;
        // Get array of property user-friendly names.
        for (const { name, value } of properties) {
            if (isNaN(parseInt(name, 10))) {
                continue;
            }
            if (!value) {
                continue;
            }
            let title = value.description;
            if (!title) {
                continue;
            }
            title = title.replace(/Prototype$/, '');
            const section = this._createSectionTreeElement(value, title, object);
            this._treeOutline.appendChild(section);
            if (!selected) {
                section.select(/* omitFocus= */ true, /* selectedByUser= */ false);
                selected = true;
            }
        }
        function protoList() {
            const result = [];
            for (let object = this; object !== null; object = Object.getPrototypeOf(object)) {
                result.push(object);
            }
            return result;
        }
    }
    _createSectionTreeElement(property, title, object) {
        const titleElement = document.createElement('span');
        titleElement.classList.add('tree-element-title');
        titleElement.textContent = title;
        const section = new ObjectUI.ObjectPropertiesSection.RootElement(property, undefined, undefined, 1 /* OwnOnly */, undefined, object);
        section.title = titleElement;
        this._expandController.watchSection(title, section);
        return section;
    }
    _onNodeChange(event) {
        if (!this._node) {
            return;
        }
        const data = event.data;
        const node = (data instanceof SDK.DOMModel.DOMNode ? data : data.node);
        if (this._node !== node) {
            return;
        }
        this.update();
    }
}
//# sourceMappingURL=PropertiesWidget.js.map