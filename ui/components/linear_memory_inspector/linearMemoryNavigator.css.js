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

.navigator {
  min-height: 24px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  overflow: hidden;
  align-items: center;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.navigator-item {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
}

.address-input {
  text-align: center;
  outline: none;
  color: var(--color-text-primary);
  border: 1px solid var(--color-background-elevation-2);
  background: transparent;
}

.address-input.invalid {
  color: var(--color-accent-red);
}

.navigator-button {
  display: flex;
  width: 20px;
  height: 20px;
  background: transparent;
  overflow: hidden;
  border: none;
  padding: 0;
  outline: none;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.navigator-button devtools-icon {
  height: 14px;
  width: 14px;
  min-height: 14px;
  min-width: 14px;
}

.navigator-button:enabled:hover devtools-icon {
  --icon-color: var(--color-text-primary);
}

.navigator-button:enabled:focus devtools-icon {
  --icon-color: var(--color-text-secondary);
}

/*# sourceURL=linearMemoryNavigator.css */
`);
export default styles;
