import TablebergIcon from "@tableberg/shared/icons/tableberg";
import { BlockIcon } from "@wordpress/block-editor";
import { Button, Flex, Placeholder, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState } from "react";
import { useTableStore } from "../../../store";
import {
    Cell,
    CellKey,
    TextElementType,
    attrVersion,
    attrDefaults,
    getCellKey,
} from "../../../attributes";
import { textAttributeDefaults } from "../../../elements";

export default function TableCreator() {
    const [rows, setRows] = useState<number | undefined>(4);
    const [cols, setCols] = useState<number | undefined>(4);
    const setAttrVersion = useTableStore(state => state.setAttrVersion);
    const setTable = useTableStore(state => state.setTable);
    const setCells = useTableStore(state => state.setCells);
    const setCellDefaults = useTableStore(state => state.setCellDefaults);

    const onCreateNew = () => {
        if (!rows || !cols) return;
        if (rows < 1 || cols < 1) return;

        const cells: Record<CellKey, Cell> = {};
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const textElement: TextElementType = {
                    name: "text",
                    attributes: { ...textAttributeDefaults },
                };
                cells[getCellKey(r, c)] = { elements: [textElement] };
            }
        }

        setAttrVersion(attrVersion);
        setTable({ ...attrDefaults.table, rows, cols });
        setCells(cells);
        setCellDefaults(attrDefaults.cellDefaults);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            onCreateNew();
        }
    };

    return (
        <div className="tableberg-table-creator">
            <Placeholder
                label={__("Tableberg", "tableberg")}
                icon={<BlockIcon icon={TablebergIcon} />}
            >
                <div className="tableberg-table-creator-heading">
                    {__("Create Blank Table", "tableberg")}
                </div>
                <Flex gap="10px" justify="center" align="end">
                    <TextControl
                        __nextHasNoMarginBottom
                        type="number"
                        label={__("Column count", "tableberg")}
                        value={String(cols)}
                        onChange={count => {
                            setCols(count === "" ? undefined : Number(count));
                        }}
                        onKeyDown={handleKeyDown}
                        min="1"
                        className="blocks-table__placeholder-input"
                    />
                    <TextControl
                        __nextHasNoMarginBottom
                        type="number"
                        label={__("Row count", "tableberg")}
                        value={String(rows)}
                        onChange={count => {
                            setRows(count === "" ? undefined : Number(count));
                        }}
                        onKeyDown={handleKeyDown}
                        min="1"
                        className="blocks-table__placeholder-input"
                    />
                    <Button
                        className="blocks-table__placeholder-button"
                        variant="primary"
                        onClick={onCreateNew}
                        type="button"
                    >
                        {__("Create", "tableberg")}
                    </Button>
                </Flex>
            </Placeholder>
        </div>
    );
}
