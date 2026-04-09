import { type OnLinkDetected } from './EnrichedMarkdownInputNativeComponent';
export type { OnLinkDetected } from './EnrichedMarkdownInputNativeComponent';
import type { HostInstance, ViewStyle, TextStyle, ColorValue } from 'react-native';
import type { RefObject } from 'react';
export interface MarkdownInputStyle {
    strong?: {
        color?: string;
    };
    em?: {
        color?: string;
    };
    link?: {
        color?: string;
        underline?: boolean;
    };
}
export interface StyleState {
    bold: {
        isActive: boolean;
    };
    italic: {
        isActive: boolean;
    };
    underline: {
        isActive: boolean;
    };
    strikethrough: {
        isActive: boolean;
    };
    link: {
        isActive: boolean;
    };
    unorderedList: {
        isActive: boolean;
    };
    orderedList: {
        isActive: boolean;
    };
}
export interface ContextMenuItem {
    text: string;
    onPress: (event: {
        text: string;
        selection: {
            start: number;
            end: number;
        };
        styleState: StyleState;
    }) => void;
    icon?: string;
    visible?: boolean;
}
export interface EnrichedMarkdownInputInstance {
    focus: () => void;
    blur: () => void;
    measure: HostInstance['measure'];
    measureInWindow: HostInstance['measureInWindow'];
    measureLayout: HostInstance['measureLayout'];
    setValue: (markdown: string) => void;
    setSelection: (start: number, end: number) => void;
    toggleBold: () => void;
    toggleItalic: () => void;
    toggleUnderline: () => void;
    toggleStrikethrough: () => void;
    toggleUnorderedList: () => void;
    toggleOrderedList: () => void;
    setLink: (url: string) => void;
    insertLink: (text: string, url: string) => void;
    removeLink: () => void;
    getMarkdown: () => Promise<string>;
}
export interface EnrichedMarkdownInputProps {
    ref?: RefObject<EnrichedMarkdownInputInstance | null>;
    defaultValue?: string;
    placeholder?: string;
    placeholderTextColor?: ColorValue;
    editable?: boolean;
    autoFocus?: boolean;
    scrollEnabled?: boolean;
    autoCapitalize?: string;
    multiline?: boolean;
    cursorColor?: ColorValue;
    selectionColor?: ColorValue;
    markdownStyle?: MarkdownInputStyle;
    style?: ViewStyle | TextStyle;
    onChangeText?: (text: string) => void;
    onChangeMarkdown?: (markdown: string) => void;
    onChangeSelection?: (selection: {
        start: number;
        end: number;
    }) => void;
    onChangeState?: (state: StyleState) => void;
    onLinkDetected?: (event: OnLinkDetected) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    contextMenuItems?: ContextMenuItem[];
    linkRegex?: RegExp | null;
}
export declare const EnrichedMarkdownInput: ({ ref, markdownStyle, style, defaultValue, placeholder, placeholderTextColor, editable, autoFocus, scrollEnabled, autoCapitalize, multiline, cursorColor, selectionColor, onChangeText, onChangeMarkdown, onChangeSelection, onChangeState, onLinkDetected, onFocus, onBlur, contextMenuItems, linkRegex: _linkRegex, }: EnrichedMarkdownInputProps) => import("react/jsx-runtime").JSX.Element;
export default EnrichedMarkdownInput;
//# sourceMappingURL=EnrichedMarkdownInput.d.ts.map