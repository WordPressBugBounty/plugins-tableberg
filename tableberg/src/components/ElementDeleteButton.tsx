import { ToolbarButton } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { trash } from "@wordpress/icons";
import { CellKey } from "../attributes";
import { useTableStore } from "../store";

export function ElementDeleteButton({
    cellCoords,
    elementIndex,
}: {
    cellCoords: CellKey;
    elementIndex: number;
}) {
    const removeElementFromCell = useTableStore(
        state => state.removeElementFromCell
    );

    return (
        <ToolbarButton
            icon={trash}
            label={__("Delete element", "tableberg")}
            title={__("Delete element", "tableberg")}
            isDestructive
            onClick={() => removeElementFromCell(cellCoords, elementIndex)}
        />
    );
}
