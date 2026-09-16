function setByPath<T>(obj: T, path: string, value: unknown): T {
    const keys = path.split(".");

    if (keys.length === 1) {
        return { ...obj, [keys[0]]: value };
    }

    const root = { ...obj } as Record<string, unknown>;
    let current = root;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...(current[key] as Record<string, unknown>) };
        current = current[key] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = value;
    return root as T;
}

function mergeWithDefaults<T>(attrs: Partial<T>, defaults: T): T {
    const result = { ...defaults };

    for (const key in attrs) {
        const attrValue = attrs[key];
        const defaultValue = defaults[key];

        if (
            attrValue !== undefined &&
            typeof attrValue === "object" &&
            attrValue !== null &&
            !Array.isArray(attrValue) &&
            typeof defaultValue === "object" &&
            defaultValue !== null &&
            !Array.isArray(defaultValue)
        ) {
            result[key] = {
                ...defaultValue,
                ...attrValue,
            } as T[Extract<keyof T, string>];
        } else if (attrValue !== undefined) {
            result[key] = attrValue as T[Extract<keyof T, string>];
        }
    }

    return result;
}

function applyBindings<T>(
    attrs: T,
    bindings: ElementBindings | undefined,
    previewValues: Record<string, string | null>,
    defaultFallback?: string
): T {
    if (!bindings) return attrs;

    let result = attrs;

    for (const path of Object.keys(bindings)) {
        const preview = previewValues[path];

        if (preview != null) {
            result = setByPath(result, path, preview);
        } else if (defaultFallback != null) {
            result = setByPath(result, path, defaultFallback);
        }
    }

    return result;
}

export type ElementBindings = Record<string, string>;

export function mergeAttrsWithDefaultsAndApplyBindings<T>(
    attrs: Partial<T>,
    defaults: T,
    bindings: ElementBindings | undefined,
    previewValues: Record<string, string | null>,
    defaultFallback?: string
): T {
    const merged = mergeWithDefaults(attrs, defaults);
    return applyBindings(merged, bindings, previewValues, defaultFallback);
}
