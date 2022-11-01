// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright (c) 2021 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

.content {
  display: grid;
  grid-template-columns: min-content 1fr;
}

.key {
  color: var(--color-text-secondary);
  padding: 0 6px;
  text-align: right;
  white-space: pre;
}

.value {
  color: var(--color-text-primary);
  margin-inline-start: 0;
  padding: 0 6px;
}

.error-text {
  color: var(--color-red);
  font-weight: bold;
}

/*# sourceURL=originTrialTokenRows.css */
`);
export default styles;
