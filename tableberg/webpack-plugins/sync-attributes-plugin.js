/**
 * Webpack Plugin: Sync Attributes
 *
 * Watches src/attributes.ts and automatically syncs changes to:
 * - src/blocks/table/block.json (attribute types and defaults)
 * - renderer/Table/Defaults.php (PHP class with defaults)
 *
 * Runs during both build and watch modes.
 */

const fs = require("fs");
const path = require("path");

class SyncAttributesPlugin {
    constructor(options = {}) {
        this.options = {
            attributesPath:
                options.attributesPath ||
                path.resolve(__dirname, "../src/attributes.ts"),
            blockJsonPath:
                options.blockJsonPath ||
                path.resolve(__dirname, "../src/blocks/table/block.json"),
            phpPath:
                options.phpPath ||
                path.resolve(__dirname, "../renderer/Table/Defaults.php"),
            verbose: options.verbose !== false,
            ...options,
        };

        this.lastSyncTime = 0;
        this.syncDebounceMs = 100;
        this.hasRunInitialSync = false;
    }

    apply(compiler) {
        const pluginName = "SyncAttributesPlugin";

        // Run sync once on initial compilation only
        compiler.hooks.beforeCompile.tapAsync(
            pluginName,
            (params, callback) => {
                if (!this.hasRunInitialSync) {
                    this.syncAttributes();
                    this.hasRunInitialSync = true;
                }
                callback();
            }
        );

        // In watch mode, add the attributes file as a watched dependency
        compiler.hooks.afterCompile.tap(pluginName, compilation => {
            if (compiler.watchMode) {
                compilation.fileDependencies.add(this.options.attributesPath);
            }
        });

        // Watch for changes to attributes.ts in watch mode
        compiler.hooks.watchRun.tapAsync(pluginName, (compiler, callback) => {
            const changedFiles = compiler.modifiedFiles || new Set();

            if (changedFiles.has(this.options.attributesPath)) {
                // Debounce to avoid multiple syncs
                const now = Date.now();
                if (now - this.lastSyncTime > this.syncDebounceMs) {
                    this.log("\nAttributes file changed, re-syncing...");
                    this.syncAttributes();
                    this.lastSyncTime = now;
                }
            }

            callback();
        });
    }

    syncAttributes() {
        try {
            const { types, defaults } = this.parseAttributesFile();
            this.generateBlockJson(types, defaults);
            this.generatePhpDefaultsClass(defaults);

            if (this.options.verbose) {
                this.log("✓ Synced attributes.ts → block.json & Defaults.php");
            }
        } catch (error) {
            console.error(`\n❌ SyncAttributesPlugin Error: ${error.message}`);
            throw error;
        }
    }

    parseAttributesFile() {
        if (!fs.existsSync(this.options.attributesPath)) {
            throw new Error(
                `Attributes file not found: ${this.options.attributesPath}`
            );
        }

        const content = fs.readFileSync(this.options.attributesPath, "utf-8");

        // Extract TablebergBlockAttrs interface
        const interfaceMatch = content.match(
            /export interface TablebergBlockAttrs\s*{([^}]+)}/s
        );
        if (!interfaceMatch) {
            throw new Error("Could not find TablebergBlockAttrs interface");
        }

        // Extract attrDefaults object
        const defaultsMatch = content.match(
            /export const attrDefaults: TablebergBlockAttrs = ({[\s\S]+?^});$/m
        );
        if (!defaultsMatch) {
            throw new Error("Could not find attrDefaults constant");
        }

        const arrayTypeAliases = this.parseArrayTypeAliases(content);
        const types = this.parseInterface(interfaceMatch[1], arrayTypeAliases);
        const defaults = this.parseDefaults(defaultsMatch[1]);

        return { types, defaults };
    }

    parseArrayTypeAliases(content) {
        const aliases = new Set();
        const aliasRegex = /export type (\w+)\s*=\s*Array[<\s]/g;
        let match;

        while ((match = aliasRegex.exec(content)) !== null) {
            aliases.add(match[1]);
        }

        return aliases;
    }

    parseInterface(interfaceBody, arrayTypeAliases) {
        const types = {};
        const lines = interfaceBody.split("\n");

        for (const line of lines) {
            const match = line.trim().match(/^(\w+)\??\s*:\s*(.+?);?$/);
            if (match) {
                const [, field, type] = match;
                types[field] = this.mapTypeScriptType(
                    type.trim(),
                    arrayTypeAliases
                );
            }
        }

        return types;
    }

    mapTypeScriptType(tsType, arrayTypeAliases = new Set()) {
        if (
            tsType.includes("Array") ||
            tsType.endsWith("[]") ||
            arrayTypeAliases.has(tsType)
        ) {
            return "array";
        }
        if (tsType.includes("Record") || tsType.includes("object")) {
            return "object";
        }
        if (tsType.includes("string")) return "string";
        if (tsType.includes("number")) return "number";
        if (tsType.includes("boolean")) return "boolean";
        return "object";
    }

    parseDefaults(objectLiteral) {
        try {
            let jsonString = objectLiteral
                .replace(/(\w+):/g, '"$1":')
                .replace(/,(\s*[}\]])/g, "$1")
                .replace(/'/g, '"');

            return JSON.parse(jsonString);
        } catch (error) {
            throw new Error(`Failed to parse attrDefaults: ${error.message}`);
        }
    }

    generateBlockJson(types, defaults) {
        if (!fs.existsSync(this.options.blockJsonPath)) {
            throw new Error(
                `block.json not found: ${this.options.blockJsonPath}`
            );
        }

        const blockJson = JSON.parse(
            fs.readFileSync(this.options.blockJsonPath, "utf-8")
        );

        const attributes = {};
        for (const [key, defaultValue] of Object.entries(defaults)) {
            attributes[key] = {
                type: types[key] || "object",
                default: defaultValue,
            };
        }

        blockJson.attributes = attributes;

        fs.writeFileSync(
            this.options.blockJsonPath,
            JSON.stringify(blockJson, null, 4) + "\n",
            "utf-8"
        );
    }

    generatePhpDefaultsClass(defaults) {
        const phpArray = this.convertJsValueToPhp(defaults, 2);

        const phpContent = `<?php

/**
 * Block Defaults
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: packages/tableberg/src/attributes.ts
 *
 * @package Tableberg
 */

namespace Tableberg\\Renderer\\Table;

/**
 * Table Block Defaults
 */
class Defaults {
    /**
     * Get default attribute values for the table block
     *
     * @return array
     */
    public static function get_defaults() {
        return ${phpArray};
    }
}
`;

        fs.writeFileSync(this.options.phpPath, phpContent, "utf-8");
    }

    convertJsValueToPhp(value, indent = 0) {
        const indentStr = "    ".repeat(indent);
        const nextIndentStr = "    ".repeat(indent + 1);

        if (value === null) {
            return "null";
        }

        if (typeof value === "boolean") {
            return value ? "true" : "false";
        }

        if (typeof value === "number") {
            return String(value);
        }

        if (typeof value === "string") {
            const escaped = value.replace(/'/g, "\\'");
            return `'${escaped}'`;
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return "[]";
            }

            const items = value.map(item => {
                return (
                    nextIndentStr + this.convertJsValueToPhp(item, indent + 1)
                );
            });

            return `[\n${items.join(",\n")},\n${indentStr}]`;
        }

        if (typeof value === "object") {
            const entries = Object.entries(value);

            if (entries.length === 0) {
                return "[]";
            }

            const items = entries.map(([key, val]) => {
                const phpKey = this.convertJsValueToPhp(key, 0);
                const phpVal = this.convertJsValueToPhp(val, indent + 1);
                return `${nextIndentStr}${phpKey} => ${phpVal}`;
            });

            return `[\n${items.join(",\n")},\n${indentStr}]`;
        }

        return "null";
    }

    log(message) {
        console.log(message);
    }
}

module.exports = SyncAttributesPlugin;
