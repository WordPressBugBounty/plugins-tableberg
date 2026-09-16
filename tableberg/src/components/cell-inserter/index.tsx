import { useState, useEffect, useMemo } from "react";
import { Dropdown, Button, SearchControl } from "@wordpress/components";
import { useDispatch } from "@wordpress/data";
import { store as editorStore } from "@wordpress/editor";
import { plus } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import InserterList from "./inserter-list";
import { InserterItem } from "./items";

const MAX_ITEMS = 6;

interface CellInserterProps {
    items: InserterItem[];
    onSelect: (item: InserterItem) => void;
    onOpenChange?: (isOpen: boolean) => void;
}

function InserterContent({
    items,
    onSelect,
    onClose,
}: {
    items: InserterItem[];
    onSelect: (item: InserterItem) => void;
    onClose: () => void;
}) {
    const [searchValue, setSearchValue] = useState("");
    const { setIsInserterOpened } = useDispatch(editorStore);

    const filteredItems = useMemo(() => {
        const normalizedSearch = searchValue.toLowerCase().trim();

        if (!normalizedSearch) {
            return items.slice(0, MAX_ITEMS);
        }

        return items
            .filter(item => item.title.toLowerCase().includes(normalizedSearch))
            .slice(0, MAX_ITEMS);
    }, [items, searchValue]);

    const handleBrowseAll = () => {
        onClose();
        setIsInserterOpened(true);
    };

    return (
        <div className="tableberg-cell-inserter__content">
            <SearchControl
                className="tableberg-cell-inserter__search"
                value={searchValue}
                onChange={setSearchValue}
                label={__("Search", "tableberg")}
                placeholder={__("Search", "tableberg")}
            />
            <InserterList items={filteredItems} onSelect={onSelect} />
            <Button
                className="tableberg-cell-inserter__browse-all"
                onClick={handleBrowseAll}
            >
                {__("Browse all", "tableberg")}
            </Button>
        </div>
    );
}

export default function CellInserter({
    items,
    onSelect,
    onOpenChange,
}: CellInserterProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        onOpenChange?.(isOpen);
    }, [isOpen, onOpenChange]);

    return (
        <Dropdown
            className="tableberg-cell-inserter"
            contentClassName="tableberg-cell-inserter__popover"
            popoverProps={{
                placement: "bottom-end",
            }}
            onToggle={setIsOpen}
            renderToggle={({ isOpen: dropdownIsOpen, onToggle }) => (
                <Button
                    className="tableberg-cell-inserter__toggle"
                    icon={plus}
                    label={__("Add element", "tableberg")}
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onToggle();
                    }}
                    aria-expanded={dropdownIsOpen}
                />
            )}
            renderContent={({ onClose }) => (
                <InserterContent
                    items={items}
                    onSelect={item => {
                        onSelect(item);
                        onClose();
                    }}
                    onClose={onClose}
                />
            )}
        />
    );
}

export { getCellInserterItems } from "./items";
export type { InserterItem } from "./items";
