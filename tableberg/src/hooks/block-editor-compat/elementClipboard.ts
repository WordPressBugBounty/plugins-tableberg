import { createBlock, serialize } from "@wordpress/blocks";

import { CellElement } from "../../attributes";
import { getExtendedElementDefinitions } from "../../extensions";

const CLIPBOARD_PREFIX = "TABLEBERG_ELEMENT:";
const STYLE_CLIPBOARD_PREFIX = "TABLEBERG_ELEMENT_STYLES:";

type RecordValue = Record<string, unknown>;

export type ElementStyleClipboardPayload = {
    name: string;
    attributes: RecordValue;
};

const SAME_TYPE_TOP_LEVEL_STYLE_ATTRS = new Set([
    "align",
    "height",
    "width",
    "aspectRatio",
    "scale",
    "sizeSlug",
    "border",
    "borderRadius",
]);

const CROSS_TYPE_TOP_LEVEL_STYLE_ATTRS = new Set(["align"]);

const CROSS_TYPE_STYLE_KEYS = new Set([
    "backgroundColor",
    "textColor",
    "linkColor",
    "fontSize",
    "padding",
    "margin",
    "border",
    "borderRadius",
]);

let fallbackClipboardText = "";

export function cloneValue<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

export function isCellElement(value: unknown): value is CellElement {
    if (!value || typeof value !== "object") {
        return false;
    }

    const element = value as Partial<CellElement>;
    const supportedElementNames = new Set([
        "text",
        "button",
        "image",
        "list",
        "icon",
        "star-rating",
        "custom-html",
        ...getExtendedElementDefinitions().map(definition => definition.name),
    ]);

    return (
        typeof element.name === "string" &&
        supportedElementNames.has(element.name) &&
        !!element.attributes &&
        typeof element.attributes === "object"
    );
}

export function serializeElementClipboardPayload(element: CellElement): string {
    // Native block markup: Gutenberg's paste handler recreates the element
    // block anywhere it is pasted — no custom paste path needed.
    const attrs: Record<string, unknown> = {
        ...(element.attributes ?? {}),
    };
    if (element.bindings && Object.keys(element.bindings).length > 0) {
        attrs.bindings = element.bindings;
    }

    return serialize(createBlock(`tableberg/${element.name}`, attrs));
}

export function parseElementClipboardPayload(text: string): CellElement | null {
    if (!text.startsWith(CLIPBOARD_PREFIX)) {
        return null;
    }

    try {
        const parsed = JSON.parse(
            text.slice(CLIPBOARD_PREFIX.length)
        ) as unknown;

        if (!isCellElement(parsed)) {
            return null;
        }

        return cloneValue(parsed);
    } catch {
        return null;
    }
}

function isRecord(value: unknown): value is RecordValue {
    return !!value && typeof value === "object" && !Array.isArray(value);
}

function getElementAttributes(element: CellElement): RecordValue {
    return element.attributes as RecordValue;
}

function createElementStyleClipboardPayload(
    element: CellElement
): ElementStyleClipboardPayload {
    const attributes = getElementAttributes(element);
    const styleAttributes: RecordValue = {};

    if (isRecord(attributes.styles)) {
        styleAttributes.styles = cloneValue(attributes.styles);
    }

    SAME_TYPE_TOP_LEVEL_STYLE_ATTRS.forEach(attrName => {
        if (attributes[attrName] !== undefined) {
            styleAttributes[attrName] = cloneValue(attributes[attrName]);
        }
    });

    return {
        name: element.name,
        attributes: styleAttributes,
    };
}

export function serializeElementStyleClipboardPayload(
    element: CellElement
): string {
    return `${STYLE_CLIPBOARD_PREFIX}${JSON.stringify(
        createElementStyleClipboardPayload(element)
    )}`;
}

export function parseElementStyleClipboardPayload(
    text: string
): ElementStyleClipboardPayload | null {
    if (!text.startsWith(STYLE_CLIPBOARD_PREFIX)) {
        return null;
    }

    try {
        const parsed = JSON.parse(
            text.slice(STYLE_CLIPBOARD_PREFIX.length)
        ) as unknown;

        if (
            !isRecord(parsed) ||
            typeof parsed.name !== "string" ||
            !isRecord(parsed.attributes)
        ) {
            return null;
        }

        return cloneValue(parsed) as ElementStyleClipboardPayload;
    } catch {
        return null;
    }
}

export function applyElementStyleClipboardPayload(
    targetElement: CellElement,
    payload: ElementStyleClipboardPayload
): CellElement {
    const isSameType = payload.name === targetElement.name;
    const targetAttributes = getElementAttributes(targetElement);
    const payloadAttributes = payload.attributes;
    const nextAttributes: RecordValue = { ...targetAttributes };

    if (isRecord(payloadAttributes.styles)) {
        const targetStyles = isRecord(targetAttributes.styles)
            ? targetAttributes.styles
            : {};
        const nextStyles: RecordValue = { ...targetStyles };

        Object.entries(payloadAttributes.styles).forEach(([key, value]) => {
            if (
                isSameType ||
                (CROSS_TYPE_STYLE_KEYS.has(key) && key in targetStyles)
            ) {
                nextStyles[key] = cloneValue(value);
            }
        });

        if (Object.keys(nextStyles).length > 0) {
            nextAttributes.styles = nextStyles;
        }
    }

    Object.entries(payloadAttributes).forEach(([key, value]) => {
        if (key === "styles") {
            return;
        }

        const allowedTopLevelAttrs = isSameType
            ? SAME_TYPE_TOP_LEVEL_STYLE_ATTRS
            : CROSS_TYPE_TOP_LEVEL_STYLE_ATTRS;

        if (allowedTopLevelAttrs.has(key) && key in targetAttributes) {
            nextAttributes[key] = cloneValue(value);
        }
    });

    return {
        ...targetElement,
        attributes: nextAttributes as CellElement["attributes"],
    } as CellElement;
}

export async function writeClipboardText(text: string): Promise<boolean> {
    fallbackClipboardText = text;

    if (!navigator.clipboard?.writeText) {
        return false;
    }

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

export async function readClipboardText(): Promise<string> {
    if (!navigator.clipboard?.readText) {
        return fallbackClipboardText;
    }

    try {
        return await navigator.clipboard.readText();
    } catch {
        return fallbackClipboardText;
    }
}
