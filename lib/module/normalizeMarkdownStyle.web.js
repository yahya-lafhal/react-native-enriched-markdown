"use strict";

const SYSTEM_FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const MONOSPACE_FONT = 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace';
function mergeSubStyle(defaultStyle, userStyle) {
  if (!userStyle) return defaultStyle;
  return {
    ...defaultStyle,
    ...userStyle
  };
}
const defaultTextColor = '#1F2937';
const defaultHeadingColor = '#111827';
const baseHeader = {
  fontFamily: SYSTEM_FONT,
  fontWeight: '',
  marginTop: 0,
  marginBottom: 8,
  textAlign: 'auto'
};
const DEFAULT_NORMALIZED_STYLE = Object.freeze({
  paragraph: {
    fontSize: 16,
    fontFamily: SYSTEM_FONT,
    fontWeight: '',
    color: defaultTextColor,
    lineHeight: 26,
    marginTop: 0,
    marginBottom: 16,
    textAlign: 'auto'
  },
  h1: {
    ...baseHeader,
    fontSize: 30,
    color: defaultHeadingColor,
    lineHeight: 38
  },
  h2: {
    ...baseHeader,
    fontSize: 24,
    color: defaultHeadingColor,
    lineHeight: 32
  },
  h3: {
    ...baseHeader,
    fontSize: 20,
    color: defaultHeadingColor,
    lineHeight: 28
  },
  h4: {
    ...baseHeader,
    fontSize: 18,
    color: defaultHeadingColor,
    lineHeight: 26
  },
  h5: {
    ...baseHeader,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24
  },
  h6: {
    ...baseHeader,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22
  },
  blockquote: {
    fontSize: 16,
    fontFamily: SYSTEM_FONT,
    fontWeight: '',
    color: '#4B5563',
    lineHeight: 26,
    marginTop: 0,
    marginBottom: 16,
    borderColor: '#D1D5DB',
    borderWidth: 3,
    gapWidth: 16,
    backgroundColor: '#F9FAFB'
  },
  list: {
    fontSize: 16,
    fontFamily: SYSTEM_FONT,
    fontWeight: '',
    color: defaultTextColor,
    lineHeight: 26,
    marginTop: 0,
    marginBottom: 16,
    bulletColor: '#6B7280',
    bulletSize: 6,
    markerColor: '#6B7280',
    markerFontWeight: '500',
    gapWidth: 12,
    marginLeft: 24
  },
  codeBlock: {
    fontSize: 14,
    fontFamily: MONOSPACE_FONT,
    fontWeight: '',
    color: '#F3F4F6',
    lineHeight: 22,
    marginTop: 0,
    marginBottom: 16,
    backgroundColor: '#1F2937',
    borderColor: '#374151',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16
  },
  link: {
    fontFamily: '',
    color: '#2563EB',
    underline: true
  },
  strong: {
    fontFamily: '',
    fontWeight: 'bold',
    color: undefined
  },
  em: {
    fontFamily: '',
    fontStyle: 'italic',
    color: undefined
  },
  strikethrough: {
    color: '#9CA3AF'
  },
  underline: {
    color: defaultTextColor
  },
  code: {
    fontFamily: MONOSPACE_FONT,
    fontSize: 0,
    color: '#E01E5A',
    backgroundColor: '#FDF2F4',
    borderColor: '#F8D7DA'
  },
  image: {
    height: 200,
    borderRadius: 8,
    marginTop: 0,
    marginBottom: 16
  },
  inlineImage: {
    size: 20
  },
  thematicBreak: {
    color: '#E5E7EB',
    height: 1,
    marginTop: 24,
    marginBottom: 24
  },
  table: {
    fontSize: 14,
    fontFamily: SYSTEM_FONT,
    fontWeight: '',
    color: defaultTextColor,
    marginTop: 0,
    marginBottom: 16,
    lineHeight: 22,
    headerFontFamily: '',
    headerBackgroundColor: '#F3F4F6',
    headerTextColor: '#111827',
    rowEvenBackgroundColor: '#FFFFFF',
    rowOddBackgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 6,
    cellPaddingHorizontal: 12,
    cellPaddingVertical: 8
  },
  math: {
    fontSize: 20,
    color: defaultTextColor,
    backgroundColor: '#F3F4F6',
    padding: 12,
    marginTop: 0,
    marginBottom: 16,
    textAlign: 'center'
  },
  inlineMath: {
    color: defaultTextColor
  },
  taskList: {
    checkedColor: '#007AFF',
    borderColor: '#9E9E9E',
    checkboxSize: 14,
    checkboxBorderRadius: 3,
    checkmarkColor: '#FFFFFF',
    checkedTextColor: '#000000',
    checkedStrikethrough: false
  }
});
const refCache = new WeakMap();
const structuralCache = [];
const LRU_MAX = 8;
const isStyleEqual = (a, b) => {
  const keys = Object.keys(DEFAULT_NORMALIZED_STYLE);
  return keys.every(key => {
    const subA = a[key],
      subB = b[key];
    if (subA === subB) return true;
    if (!subA || !subB) return false;
    const subKeys = Object.keys(subA);
    return subKeys.every(k => subA[k] === subB[k]);
  });
};
export const normalizeMarkdownStyle = style => {
  if (!style || Object.keys(style).length === 0) return DEFAULT_NORMALIZED_STYLE;
  const refHit = refCache.get(style);
  if (refHit) return refHit;
  const structIdx = structuralCache.findIndex(e => isStyleEqual(e.style, style));
  if (structIdx !== -1) {
    const entry = structuralCache.splice(structIdx, 1)[0];
    structuralCache.unshift(entry);
    refCache.set(style, entry.result);
    return entry.result;
  }
  const result = {};
  Object.keys(DEFAULT_NORMALIZED_STYLE).forEach(key => {
    result[key] = mergeSubStyle(DEFAULT_NORMALIZED_STYLE[key], style[key]);
  });
  if (style.taskList?.checkboxSize === undefined) {
    const listSize = result.list.fontSize;
    result.taskList.checkboxSize = Math.round(listSize * 0.9);
  }
  const finalResult = Object.freeze(result);
  refCache.set(style, finalResult);
  structuralCache.unshift({
    style,
    result: finalResult
  });
  if (structuralCache.length > LRU_MAX) structuralCache.pop();
  return finalResult;
};
//# sourceMappingURL=normalizeMarkdownStyle.web.js.map