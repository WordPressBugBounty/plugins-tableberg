import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@wordpress/components";
import { ENTER } from "@wordpress/keycodes";
import { InserterItem } from "./items";
import UpsellModal from "../UpsellModal";

interface InserterListItemProps {
    item: InserterItem;
    onSelect: (item: InserterItem) => void;
}

export default function InserterListItem({
    item,
    onSelect,
}: InserterListItemProps) {
    const [showUpsell, setShowUpsell] = useState(false);

    const handleClick = () => {
        if (item.disabled) {
            return;
        }

        if (item.isLocked) {
            setShowUpsell(true);
        } else {
            onSelect(item);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.keyCode === ENTER && !item.disabled) {
            event.preventDefault();
            handleClick();
        }
    };

    return (
        <>
            <div className="tableberg-cell-inserter__list-item">
                <Button
                    className="tableberg-cell-inserter__item"
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    disabled={item.disabled}
                    label={item.title}
                >
                    <span className="tableberg-cell-inserter__item-icon">
                        {item.icon}
                    </span>
                    <span className="tableberg-cell-inserter__item-title">
                        {item.title}
                    </span>
                </Button>
            </div>

            {showUpsell &&
                createPortal(
                    <UpsellModal
                        selected={item.upsellSelected}
                        onClose={() => setShowUpsell(false)}
                    />,
                    document.body
                )}
        </>
    );
}
