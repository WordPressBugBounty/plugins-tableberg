import { useEffect } from "react";
import { RichText } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { useTableStore } from "../../store";

interface TableCaptionProps {
    isSelected: boolean;
}

export function TableCaption({ isSelected }: TableCaptionProps) {
    const caption = useTableStore(state => state.table.caption || "");
    const updateTable = useTableStore(state => state.updateTable);
    const showCaption = useTableStore(state => state.showCaption);
    const setShowCaption = useTableStore(state => state.setShowCaption);

    useEffect(() => {
        if (caption.trim() !== "" && !showCaption) {
            setShowCaption(true);
        }
    }, [caption, showCaption, setShowCaption]);

    useEffect(() => {
        if (!isSelected && caption.trim() === "" && showCaption) {
            setShowCaption(false);
        }
    }, [isSelected, caption, setShowCaption, showCaption]);

    if (!showCaption && caption.trim() === "") {
        return null;
    }

    return (
        <RichText
            tagName="figcaption"
            className="tableberg-table-caption wp-element-caption"
            aria-label={__("Table caption text", "tableberg")}
            placeholder={__("Add caption", "tableberg")}
            value={caption}
            onChange={(value: string) => {
                updateTable({ caption: value });
            }}
        />
    );
}
