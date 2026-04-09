"use strict";

import { useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import EnrichedMarkdownInputNativeComponent, { Commands } from './EnrichedMarkdownInputNativeComponent';
import { normalizeMarkdownInputStyle } from "./normalizeMarkdownInputStyle.js";
import { toNativeRegexConfig } from "./utils/regexParser.js";
import { jsx as _jsx } from "react/jsx-runtime";
function getNativeRef(ref) {
  if (ref.current == null) {
    throw new Error('EnrichedMarkdownInput: native ref is not attached. Ensure the component is mounted.');
  }
  return ref.current;
}
export const EnrichedMarkdownInput = ({
  ref,
  markdownStyle,
  style,
  defaultValue,
  placeholder,
  placeholderTextColor,
  editable = true,
  autoFocus = false,
  scrollEnabled = true,
  autoCapitalize = 'sentences',
  multiline = true,
  cursorColor,
  selectionColor,
  onChangeText,
  onChangeMarkdown,
  onChangeSelection,
  onChangeState,
  onLinkDetected,
  onFocus,
  onBlur,
  contextMenuItems,
  linkRegex: _linkRegex
}) => {
  const nativeRef = useRef(null);
  const nextRequestId = useRef(1);
  const pendingRequests = useRef(new Map());
  const contextMenuCallbacksRef = useRef(new Map());
  useEffect(() => {
    const callbacksMap = new Map();
    if (contextMenuItems) {
      for (const item of contextMenuItems) {
        callbacksMap.set(item.text, item.onPress);
      }
    }
    contextMenuCallbacksRef.current = callbacksMap;
  }, [contextMenuItems]);
  const nativeContextMenuItems = useMemo(() => contextMenuItems?.filter(item => item.visible !== false).map(item => ({
    text: item.text,
    icon: item.icon
  })), [contextMenuItems]);
  useEffect(() => {
    const pending = pendingRequests.current;
    return () => {
      pending.forEach(({
        reject
      }) => {
        reject(new Error('Component unmounted'));
      });
      pending.clear();
    };
  }, []);
  const normalizedStyle = normalizeMarkdownInputStyle(markdownStyle);
  const linkRegex = useMemo(() => toNativeRegexConfig(_linkRegex), [_linkRegex]);
  const handleLinkDetected = useCallback(e => {
    const {
      text,
      url,
      start,
      end
    } = e.nativeEvent;
    onLinkDetected?.({
      text,
      url,
      start,
      end
    });
  }, [onLinkDetected]);
  const handleChangeText = useCallback(e => {
    onChangeText?.(e.nativeEvent.value);
  }, [onChangeText]);
  const handleChangeMarkdown = useCallback(e => {
    // Auto-continue lists is implemented on the native side (iOS/Android)
    // The native code detects new lines and auto-inserts list markers
    onChangeMarkdown?.(e.nativeEvent.value);
  }, [onChangeMarkdown]);
  const handleChangeSelection = useCallback(e => {
    const {
      start,
      end
    } = e.nativeEvent;
    onChangeSelection?.({
      start,
      end
    });
  }, [onChangeSelection]);
  const handleChangeState = useCallback(e => {
    const {
      bold,
      italic,
      underline,
      strikethrough,
      link,
      unorderedList,
      orderedList
    } = e.nativeEvent;
    onChangeState?.({
      bold,
      italic,
      underline,
      strikethrough,
      link,
      unorderedList: unorderedList || {
        isActive: false
      },
      orderedList: orderedList || {
        isActive: false
      }
    });
  }, [onChangeState]);
  const handleFocus = useCallback(() => {
    onFocus?.();
  }, [onFocus]);
  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);
  const handleRequestMarkdownResult = useCallback(e => {
    const {
      requestId,
      markdown
    } = e.nativeEvent;
    const pending = pendingRequests.current.get(requestId);
    if (!pending) return;
    pending.resolve(markdown);
    pendingRequests.current.delete(requestId);
  }, []);
  const handleContextMenuItemPress = useCallback(e => {
    const {
      itemText,
      selectedText,
      selectionStart,
      selectionEnd,
      styleState
    } = e.nativeEvent;
    const callback = contextMenuCallbacksRef.current.get(itemText);
    callback?.({
      text: selectedText,
      selection: {
        start: selectionStart,
        end: selectionEnd
      },
      styleState
    });
  }, []);
  useImperativeHandle(ref, () => {
    const node = getNativeRef(nativeRef);
    // Codegen's ViewRef resolves to `never` with RN 0.84's function-based
    // HostComponent type — the cast is safe at runtime.
    const commandRef = node;
    return {
      measure: callback => node.measure(callback),
      measureInWindow: callback => node.measureInWindow(callback),
      measureLayout: (relativeToNativeNode, onSuccess, onFail) => node.measureLayout(relativeToNativeNode, onSuccess, onFail),
      focus: () => Commands.focus(commandRef),
      blur: () => Commands.blur(commandRef),
      setValue: markdown => Commands.setValue(commandRef, markdown),
      setSelection: (start, end) => Commands.setSelection(commandRef, start, end),
      toggleBold: () => Commands.toggleBold(commandRef),
      toggleItalic: () => Commands.toggleItalic(commandRef),
      toggleUnderline: () => Commands.toggleUnderline(commandRef),
      toggleStrikethrough: () => Commands.toggleStrikethrough(commandRef),
      toggleUnorderedList: () => Commands.toggleUnorderedList(commandRef),
      toggleOrderedList: () => Commands.toggleOrderedList(commandRef),
      setLink: url => Commands.setLink(commandRef, url),
      insertLink: (text, url) => Commands.insertLink(commandRef, text, url),
      removeLink: () => Commands.removeLink(commandRef),
      getMarkdown: () => new Promise((resolve, reject) => {
        const requestId = nextRequestId.current++;
        pendingRequests.current.set(requestId, {
          resolve,
          reject
        });
        Commands.requestMarkdown(commandRef, requestId);
      })
    };
  });
  return /*#__PURE__*/_jsx(EnrichedMarkdownInputNativeComponent, {
    ref: nativeRef,
    style: style,
    markdownStyle: normalizedStyle,
    defaultValue: defaultValue,
    placeholder: placeholder,
    placeholderTextColor: placeholderTextColor,
    editable: editable,
    autoFocus: autoFocus,
    scrollEnabled: scrollEnabled,
    autoCapitalize: autoCapitalize,
    multiline: multiline,
    cursorColor: cursorColor,
    selectionColor: selectionColor,
    isOnChangeMarkdownSet: onChangeMarkdown !== undefined,
    onChangeText: handleChangeText,
    onChangeMarkdown: handleChangeMarkdown,
    onChangeSelection: handleChangeSelection,
    onChangeState: handleChangeState,
    onLinkDetected: handleLinkDetected,
    onInputFocus: handleFocus,
    onInputBlur: handleBlur,
    onRequestMarkdownResult: handleRequestMarkdownResult,
    contextMenuItems: nativeContextMenuItems,
    onContextMenuItemPress: handleContextMenuItemPress,
    linkRegex: linkRegex
  });
};
export default EnrichedMarkdownInput;
//# sourceMappingURL=EnrichedMarkdownInput.js.map