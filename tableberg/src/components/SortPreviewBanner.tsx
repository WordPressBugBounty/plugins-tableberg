import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { useTableStore } from "../store";

export function SortPreviewBanner() {
    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const exitSortPreviewMode = useTableStore(
        state => state.exitSortPreviewMode
    );

    if (!sortPreviewMode) {
        return null;
    }

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                backgroundColor: "#f0f0f1",
                borderBottom: "1px solid #c3c4c7",
                fontSize: "13px",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                    style={{
                        fontWeight: 500,
                        color: "#1e1e1e",
                    }}
                >
                    {__("Sort Preview Mode", "tableberg")}
                </span>
            </div>
            <Button variant="secondary" onClick={exitSortPreviewMode}>
                {__("Exit Sorting Preview", "tableberg")}
            </Button>
        </div>
    );
}
