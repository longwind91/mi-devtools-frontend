// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../../../core/i18n/i18n.js';
import * as Platform from '../../../core/platform/platform.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as Coordinator from '../../../ui/components/render_coordinator/render_coordinator.js';
import * as LitHtml from '../../../ui/lit-html/lit-html.js';
import accessibilityTreeNodeStyles from './accessibilityTreeNode.css.js';
const UIStrings = {
    /**
    *@description Ignored node element text content in Accessibility Tree View of the Elements panel
    */
    ignored: 'Ignored',
};
const str_ = i18n.i18n.registerUIStrings('panels/elements/components/AccessibilityTreeNode.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
// TODO(jobay) move this to Platform.StringUtilities if still needed.
// This function is a variant of setTextContentTruncatedIfNeeded found in DOMExtension.
function truncateTextIfNeeded(text) {
    const maxTextContentLength = 10000;
    if (text.length > maxTextContentLength) {
        return Platform.StringUtilities.trimMiddle(text, maxTextContentLength);
    }
    return text;
}
export class AccessibilityTreeNode extends HTMLElement {
    static litTagName = LitHtml.literal `devtools-accessibility-tree-node`;
    shadow = this.attachShadow({ mode: 'open' });
    ignored = true;
    name = '';
    role = '';
    set data(data) {
        this.ignored = data.ignored;
        this.name = data.name;
        this.role = data.role;
        this.render();
    }
    connectedCallback() {
        this.shadow.adoptedStyleSheets = [accessibilityTreeNodeStyles];
    }
    async render() {
        await Coordinator.RenderCoordinator.RenderCoordinator.instance().write('Accessibility node render', () => {
            // clang-format off
            LitHtml.render(LitHtml.html `
      ${this.ignored ?
                LitHtml.html `<span class='monospace ignored-node'>${i18nString(UIStrings.ignored)}</span>` :
                LitHtml.html `
             <span class='monospace'>${truncateTextIfNeeded(this.role)}</span>
             <span class='separator'>\xA0</span>
             <span class='ax-readable-string'>"${this.name}"</span>
          `}
     `, this.shadow, {
                host: this,
            });
            // clang-format on
        });
    }
}
ComponentHelpers.CustomElements.defineComponent('devtools-accessibility-tree-node', AccessibilityTreeNode);
//# sourceMappingURL=AccessibilityTreeNode.js.map