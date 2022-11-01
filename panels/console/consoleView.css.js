// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright (C) 2006, 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2009 Anthony Ricaud <rik@webkit.org>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

.console-view {
  background-color: var(--color-background);
  overflow: hidden;

  --override-error-text-color: var(--color-error-text);
  --override-console-error-background-color: var(--color-error-background);
  --override-error-border-color: var(--color-error-border);
  --override-message-border-color: rgb(240 240 240);
  --override-warning-border-color: hsl(50deg 100% 88%);
  --override-focused-message-border-color: hsl(214deg 67% 88%);
  --override-focused-message-background-color: hsl(214deg 48% 95%);
  --override-console-warning-background-color: hsl(50deg 100% 95%);
  --override-console-warning-text-color: hsl(39deg 100% 18%);
}

.-theme-with-dark-background .console-view {
  --override-message-border-color: rgb(58 58 58);
  --override-warning-border-color: rgb(102 85 0);
  --override-focused-message-border-color: hsl(214deg 47% 48%);
  --override-focused-message-background-color: hsl(214deg 19% 20%);
  --override-console-warning-background-color: hsl(50deg 100% 10%);
  --override-console-warning-text-color: hsl(39deg 89% 55%);
}

.console-toolbar-container {
  display: flex;
  flex: none;
}

.console-main-toolbar {
  flex: 1 1 auto;
}

.console-toolbar-container > .toolbar {
  background-color: var(--color-background-elevation-1);
  border-bottom: var(--legacy-divider-border);
}

.console-view-fix-select-all {
  height: 0;
  overflow: hidden;
}

.console-settings-pane {
  flex: none;
  background-color: var(--color-background-elevation-1);
  border-bottom: var(--legacy-divider-border);
}

.console-settings-pane .toolbar {
  flex: 1 1;
}

#console-messages {
  flex: 1 1;
  overflow-y: auto;
  word-wrap: break-word;
  user-select: text;
  transform: translateZ(0);
  overflow-anchor: none;  /* Chrome-specific scroll-anchoring opt-out */
}

#console-prompt {
  clear: right;
  position: relative;
  margin: 0 22px 0 20px;
}

.console-prompt-editor-container {
  min-height: 21px;
}

.console-message,
.console-user-command {
  clear: right;
  position: relative;
  padding: 3px 22px 1px 0;
  margin-left: 24px;
  min-height: 17px;  /* Sync with ConsoleViewMessage.js */
  flex: auto;
  display: flex;
}

.console-message > * {
  flex: auto;
}

.console-timestamp {
  color: var(--color-text-secondary);
  user-select: none;
  flex: none;
  margin-right: 5px;
}

.message-level-icon,
.command-result-icon {
  position: absolute;
  left: -17px;
  top: 4px;
  user-select: none;
}

.console-message-repeat-count {
  margin: 2px 0 0 10px;
  flex: none;
}

.repeated-message {
  margin-left: 4px;
}

.repeated-message .message-level-icon {
  display: none;
}

.console-message-stack-trace-toggle {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.repeated-message .console-message-stack-trace-toggle,
.repeated-message > .console-message-text {
  flex: 1;
}

.console-error-level .repeated-message,
.console-warning-level .repeated-message,
.console-verbose-level .repeated-message,
.console-info-level .repeated-message {
  display: flex;
}

.console-info {
  color: var(--color-text-secondary);
  font-style: italic;
  padding-bottom: 2px;
}

.console-group .console-group > .console-group-messages {
  margin-left: 16px;
}

.console-group-title.console-from-api {
  font-weight: bold;
}

.console-group-title .console-message {
  margin-left: 12px;
}

.expand-group-icon {
  user-select: none;
  flex: none;
  position: relative;
  left: 10px;
  top: 5px;
  margin-right: 2px;
}

.console-group-title .message-level-icon {
  display: none;
}

.console-message-repeat-count .expand-group-icon {
  left: 2px;
  top: 2px;
  background-color: var(--color-background);
  margin-right: 4px;
}

.console-group {
  position: relative;
}

.console-message-wrapper {
  display: flex;
  border-top: 1px solid var(--override-message-border-color);
  border-bottom: 1px solid transparent;
}

.console-message-wrapper:first-of-type {
  border-top-color: transparent;
}

.console-message-wrapper.console-adjacent-user-command-result:not(.console-error-level):not(.console-warning-level) {
  border-top-width: 0;
}

.console-message-wrapper:last-of-type {
  border-bottom-color: var(--override-message-border-color);
}

.console-message-wrapper:focus {
  border-top-color: var(--override-focused-message-border-color);
  border-bottom-color: var(--override-focused-message-border-color);
  background-color: var(--override-focused-message-background-color);
}

.console-message-wrapper:focus + .console-message-wrapper {
  border-top-color: transparent;
}

.console-message-wrapper.console-error-level,
.console-message-wrapper.console-error-level:not(:focus) + .console-message-wrapper:not(.console-warning-level):not(:focus) {
  border-top-color: var(--override-error-border-color);
}

.console-message-wrapper.console-warning-level,
.console-message-wrapper.console-warning-level:not(:focus) + .console-message-wrapper:not(.console-error-level):not(:focus) {
  border-top-color: var(--override-warning-border-color);
}

.console-message-wrapper.console-error-level:last-of-type {
  border-bottom-color: var(--override-error-border-color);
}

.console-message-wrapper.console-warning-level:last-of-type {
  border-bottom-color: var(--override-warning-border-color);
}

.console-message-wrapper.console-adjacent-user-command-result:not(.console-error-level):not(.console-warning-level):focus {
  border-top-width: 1px;
}

.console-message-wrapper.console-adjacent-user-command-result:not(.console-error-level):not(.console-warning-level):focus .console-message {
  padding-top: 2px;
  min-height: 16px;
}

.console-message-wrapper.console-adjacent-user-command-result:not(.console-error-level):not(.console-warning-level):focus .command-result-icon {
  top: 3px;
}

.console-message-wrapper.console-error-level:focus {
  --override-error-text-color: rgb(200 0 0);
}

.-theme-with-dark-background .console-message-wrapper.console-error-level:focus {
  --override-error-text-color: hsl(0deg 100% 75%);
}

.console-message-wrapper .nesting-level-marker {
  width: 14px;
  flex: 0 0 auto;
  border-right: 1px solid var(--color-details-hairline);
  position: relative;
  margin-bottom: -1px;
  margin-top: -1px;
}

.console-message-wrapper .nesting-level-marker::before {
  border-bottom: 1px solid var(--color-details-hairline);
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 100%;
  width: 3px;
  height: 100%;
  box-sizing: border-box;
}

.console-message-wrapper:last-child .nesting-level-marker::before,
.console-message-wrapper .nesting-level-marker.group-closed::before {
  content: "";
}

.console-error-level {
  background-color: var(--override-console-error-background-color);
}

.console-warning-level {
  background-color: var(--override-console-warning-background-color);
}

.console-warning-level .console-message-text {
  color: var(--override-console-warning-text-color);
}

.console-view-object-properties-section {
  padding: 0;
  position: relative;
  vertical-align: baseline;
  color: inherit;
  display: inline-block;
  overflow-wrap: break-word;
  max-width: 100%;
}

.info-note {
  background-color: var(--color-primary-variant);
}

.info-note::before {
  content: "i";
}

.console-view-object-properties-section:not(.expanded) .info-note {
  display: none;
}

.console-error-level .console-message-text,
.console-error-level .console-view-object-properties-section {
  color: var(--override-error-text-color) !important; /* stylelint-disable-line declaration-no-important */
}

.console-system-type.console-info-level {
  color: #00f; /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

.-theme-with-dark-background .console-verbose-level:not(.console-warning-level) .console-message-text,
.-theme-with-dark-background .console-system-type.console-info-level {
  color: hsl(220deg 100% 65%) !important; /* stylelint-disable-line declaration-no-important */
}

#console-messages .link {
  text-decoration: underline;
}

#console-messages .link,
#console-messages .devtools-link {
  color: var(--color-text-secondary);
  cursor: pointer;
  word-break: break-all;
}

#console-messages .resource-links {
  vertical-align: bottom;
}

#console-messages .link:hover,
#console-messages .devtools-link:hover {
  color: var(--color-text-primary);
}

.console-object-preview {
  white-space: normal;
  word-wrap: break-word;
  font-style: italic;
}

.console-object-preview .name {
  flex-shrink: 0;
}

.console-message-text .object-value-string,
.console-message-text .object-value-regexp,
.console-message-text .object-value-symbol {
  white-space: pre-wrap;
  word-break: break-all;
}

.console-message-formatted-table {
  clear: both;
}

.console-message .source-code {
  line-height: 1.2;
}

.console-message-anchor {
  float: right;
  text-align: right;
  max-width: 100%;
  margin-left: 4px;
}

.console-message-badge {
  float: right;
  margin-left: 4px;
}

.console-message-nowrap-below,
.console-message-nowrap-below div,
.console-message-nowrap-below span {
  white-space: nowrap !important; /* stylelint-disable-line declaration-no-important */
}

.object-state-note {
  display: inline-block;
  width: 11px;
  height: 11px;
  color: var(--color-background);
  text-align: center;
  border-radius: 3px;
  line-height: 13px;
  margin: 0 6px;
  font-size: 9px;
}

.-theme-with-dark-background .object-state-note {
  background-color: hsl(230deg 100% 80%);
}

.console-object {
  white-space: pre-wrap;
  word-break: break-all;
}

.console-message-stack-trace-wrapper {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.console-message-stack-trace-wrapper > * {
  flex: none;
}

.console-message-expand-icon {
  margin-bottom: -2px;
}

.console-searchable-view {
  max-height: 100%;
}

.console-view-pinpane {
  flex: none;
  max-height: 50%;
}

/* We are setting width and height to 0px to essentially hide the html element on the UI but visible to the screen reader.
 This html element is used by screen readers when console messages are filtered, instead of screen readers reading
 contents of the filtered messages we only want the screen readers to read the count of filtered messages. */
.message-count {
  width: 0;
  height: 0;
}

@media (forced-colors: active) {
  .console-message-expand-icon,
  .console-warning-level [is=ui-icon].icon-mask.expand-group-icon {
    forced-color-adjust: none;
    background-color: ButtonText;
  }

  .console-message-wrapper:focus,
  .console-message-wrapper:focus:last-of-type {
    forced-color-adjust: none;
    background-color: Highlight;
    border-top-color: Highlight;
    border-bottom-color: Highlight;
  }

  .console-message-wrapper:focus *,
  .console-message-wrapper:focus:last-of-type *,
  .console-message-wrapper:focus .devtools-link,
  .console-message-wrapper:focus:last-of-type .devtools-link {
    color: HighlightText !important; /* stylelint-disable-line declaration-no-important */
  }

  #console-messages .devtools-link,
  #console-messages .devtools-link:hover {
    color: linktext;
  }

  #console-messages .link:focus-visible,
  #console-messages .devtools-link:focus-visible {
    background: Highlight;
    color: HighlightText;
  }

  .console-message-wrapper:focus [is=ui-icon].icon-mask {
    background-color: HighlightText;
  }

  .console-message-wrapper.console-error-level:focus,
  .console-message-wrapper.console-error-level:focus:last-of-type {
    --override-error-text-color: HighlightText;
  }
}

/*# sourceURL=consoleView.css */
`);
export default styles;
