import { registerNativeRowBlock } from "./row";
import { registerNativeCellBlock } from "./cell";
import { registerTextBlock } from "./text";
import { registerButtonBlock } from "./button";
import { registerImageBlock } from "./image";
import { registerListBlock } from "./list";
import { registerNativeTableBlock } from "./table";

/**
 * Registers all Tableberg blocks. Child blocks must register before the
 * table so its deprecated-entry migration can create them.
 */
export function registerNativeBlocks() {
    registerNativeRowBlock();
    registerNativeCellBlock();
    registerTextBlock();
    registerButtonBlock();
    registerImageBlock();
    registerListBlock();
    registerNativeTableBlock();
}
