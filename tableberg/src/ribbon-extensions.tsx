import { ReactNode } from "react";
import { applyFilters } from "@wordpress/hooks";

import { CellKey, RibbonConfig } from "./attributes";

/**
 * The ribbon is a pro feature. The cell block receives it as a prop from
 * pro's block extension, but the read-only preview (sort / search /
 * responsive) renders cells from a store snapshot rather than from block
 * props, so it asks for the ribbon through this filter instead.
 */
export function renderExtendedCellRibbon(
    ribbon: RibbonConfig,
    cellCoords: CellKey
): ReactNode | null {
    return applyFilters(
        "tableberg.renderCellRibbon",
        null,
        ribbon,
        cellCoords
    ) as ReactNode | null;
}
