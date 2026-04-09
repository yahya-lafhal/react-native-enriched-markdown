"use strict";

import { processColor } from 'react-native';
const normalizeColor = color => color ? processColor(color) : undefined;
const DEFAULT_LINK_COLOR = '#2563EB';
const defaultInternal = Object.freeze({
  strong: {
    color: undefined
  },
  em: {
    color: undefined
  },
  link: {
    color: processColor(DEFAULT_LINK_COLOR),
    underline: true
  }
});
let cachedInput;
let cachedResult;
export const normalizeMarkdownInputStyle = style => {
  if (!style || Object.keys(style).length === 0) {
    return defaultInternal;
  }
  if (style === cachedInput && cachedResult) {
    return cachedResult;
  }
  const result = {
    strong: {
      color: normalizeColor(style.strong?.color)
    },
    em: {
      color: normalizeColor(style.em?.color)
    },
    link: {
      color: normalizeColor(style.link?.color) ?? defaultInternal.link.color,
      underline: style.link?.underline ?? defaultInternal.link.underline
    }
  };
  cachedInput = style;
  cachedResult = result;
  return result;
};
//# sourceMappingURL=normalizeMarkdownInputStyle.js.map