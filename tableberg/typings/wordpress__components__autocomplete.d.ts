/**
 * Custom override of @wordpress/components autocomplete types.
 *
 * Path mapping is required because ReplaceOption is a type alias (not interface),
 * which cannot be augmented via `declare module`. This file completely replaces
 * the original types when importing from "@wordpress/components/build-types/autocomplete/types".
 *
 * Modified: ReplaceOption.value allows string in addition to RichTextValue,
 * which is the actual runtime behavior when using custom autocompleters.
 */

import type { ReactElement } from "react";
import type { RichTextValue } from "@wordpress/rich-text";

export type InsertOption = {
    action: "insert-at-caret";
    value: React.ReactNode;
};

export type ReplaceOption = {
    action: "replace";
    value: RichTextValue | string;
};

export type OptionCompletion = React.ReactNode | InsertOption | ReplaceOption;

type OptionLabel = string | ReactElement | Array<string | ReactElement>;

export type KeyedOption = {
    key: string;
    value: any;
    label: OptionLabel;
    keywords: Array<string>;
    isDisabled: boolean;
};

export type WPCompleter<TCompleterOption = any> = {
    name: string;
    triggerPrefix: string;
    options:
        | ((
              query: string
          ) =>
              | PromiseLike<readonly TCompleterOption[]>
              | readonly TCompleterOption[])
        | readonly TCompleterOption[];
    getOptionKeywords?: (option: TCompleterOption) => Array<string>;
    isOptionDisabled?: (option: TCompleterOption) => boolean;
    getOptionLabel: (option: TCompleterOption) => OptionLabel;
    allowContext?: (before: string, after: string) => boolean;
    getOptionCompletion?: (
        option: TCompleterOption,
        query: string
    ) => OptionCompletion;
    useItems?: (filterValue: string) => readonly [Array<KeyedOption>];
    isDebounced?: boolean;
    className?: string;
};

type ContentRef = React.RefObject<HTMLElement>;

export type AutocompleterUIProps = {
    filterValue: string;
    instanceId: number;
    listBoxId: string | undefined;
    className?: string;
    selectedIndex: number;
    onChangeOptions: (items: Array<KeyedOption>) => void;
    onSelect: (option: KeyedOption) => void;
    onReset?: () => void;
    reset: (event: Event) => void;
    value?: RichTextValue;
    contentRef: ContentRef;
};

export type CancelablePromise<T = void> = Promise<T> & {
    canceled?: boolean;
};

export type UseAutocompleteProps = {
    record: RichTextValue & {
        start: NonNullable<RichTextValue["start"]>;
        end: NonNullable<RichTextValue["end"]>;
    };
    onChange: (value: RichTextValue) => void;
    onReplace: (values: RichTextValue[]) => void;
    completers: Array<WPCompleter>;
    contentRef: ContentRef;
};

export type AutocompleteProps = UseAutocompleteProps & {
    children: (
        props: Omit<ReturnType<typeof import(".").useAutocomplete>, "popover">
    ) => React.ReactNode;
    isSelected: boolean;
};
