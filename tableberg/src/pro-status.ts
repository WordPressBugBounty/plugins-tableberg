type TablebergConfig = {
    plugin_url?: string;
    IS_PRO?: boolean;
};

export function getTablebergConfig(): TablebergConfig {
    if (typeof globalThis !== "undefined") {
        const globalConfig = (
            globalThis as typeof globalThis & {
                TABLEBERG_CFG?: TablebergConfig;
            }
        ).TABLEBERG_CFG;

        if (globalConfig) {
            return globalConfig;
        }
    }

    if (typeof window !== "undefined") {
        try {
            const parentConfig = (
                window.parent as Window & {
                    TABLEBERG_CFG?: TablebergConfig;
                }
            )?.TABLEBERG_CFG;

            if (parentConfig) {
                return parentConfig;
            }
        } catch {
            // Cross-frame access can fail; fall back to defaults.
        }
    }

    return {};
}

export function isProAvailable() {
    return Boolean(getTablebergConfig().IS_PRO);
}
