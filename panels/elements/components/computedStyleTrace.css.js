// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2021 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

:host {
  text-overflow: ellipsis;
  overflow: hidden;
  flex-grow: 1;
}

.computed-style-trace {
  margin-left: 16px;
}

.computed-style-trace:hover {
  background-color: var(--legacy-focus-bg-color);
  cursor: pointer;
}

.goto {
  /* TODO: reuse with ComputedStyleProperty */
  --size: 16px;

  display: none;
  position: absolute;
  width: var(--size);
  height: var(--size);
  margin: -1px 0 0 calc(-1 * var(--size));
  -webkit-mask-image: var(--image-file-mediumIcons);
  -webkit-mask-position: -32px 48px;
  background-color: var(--legacy-active-control-bg-color);
}

.computed-style-trace:hover .goto {
  display: inline-block;
}

.trace-value {
  margin-left: 16px;
}

.computed-style-trace.inactive slot[name="trace-value"] {
  text-decoration: line-through;
}

.trace-selector {
  --override-trace-selector-color: rgb(128 128 128);

  color: var(--override-trace-selector-color);
  padding-left: 2em;
}

::slotted([slot="trace-link"]) {
  user-select: none;
  float: right;
  padding-left: 1em;
  position: relative;
  z-index: 1;
}
/* high-contrast styles */
@media (forced-colors: active) {
  :host-context(.monospace.computed-properties) .computed-style-trace:hover {
    forced-color-adjust: none;
    background-color: Highlight;
  }

  :host-context(.monospace.computed-properties) .goto {
    background-color: HighlightText;
  }

  :host-context(.monospace.computed-properties) .computed-style-trace:hover * {
    color: HighlightText;
  }
}

/*# sourceURL=computedStyleTrace.css */
`);
export default styles;
