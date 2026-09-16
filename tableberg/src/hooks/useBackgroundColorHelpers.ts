import { __ } from "@wordpress/i18n";
import { TableCellStylesType } from "../attributes";
import { useTableStore } from "../store";

export interface ColorControlProps {
    label: string;
    value: string | undefined;
    onChange: (newValue: string) => void;
    onDeselect: () => void;
}

interface BackgroundColorHelperControls {
    headerBackgroundColorControl: ColorControlProps | null;
    evenRowBackgroundColorControl: ColorControlProps;
    oddRowBackgroundColorControl: ColorControlProps;
    footerBackgroundColorControl: ColorControlProps | null;
}

type RowPositionStyleKey =
    | "headerBackgroundColor"
    | "footerBackgroundColor"
    | "evenRowBackgroundColor"
    | "oddRowBackgroundColor";

/**
 * Header/footer/even/odd row background colours are table-wide defaults,
 * resolved per cell by row position (see `cell/index.tsx` and
 * `TableRenderer.php`) — not a bulk-write to every affected cell's own
 * background attribute. That used to be how this worked, but the per-cell
 * `backgroundColor` attribute it wrote to is pro-owned. These are free
 * features, so they read/write `cellDefaults.styles` instead, exactly like
 * "Common Cell Background Color" already does.
 */
export function useBackgroundColorHelpers(): BackgroundColorHelperControls {
    const tableConfig = useTableStore(state => state.table);
    const cellDefaultsStyles = useTableStore(
        state => state.cellDefaults.styles
    );
    const updateCellGlobalStyles = useTableStore(
        state => state.updateCellGlobalStyles
    );

    const createControlProps = (
        label: string,
        styleKey: RowPositionStyleKey
    ): ColorControlProps => ({
        label,
        value: cellDefaultsStyles[styleKey],
        onChange: (newValue: string) => {
            updateCellGlobalStyles({
                [styleKey]: newValue,
            } as Partial<TableCellStylesType>);
        },
        onDeselect: () => {
            updateCellGlobalStyles({
                [styleKey]: "",
            } as Partial<TableCellStylesType>);
        },
    });

    return {
        headerBackgroundColorControl: tableConfig.headerEnabled
            ? createControlProps(
                  __("Header Background Color", "tableberg"),
                  "headerBackgroundColor"
              )
            : null,
        evenRowBackgroundColorControl: createControlProps(
            __("Even Row Background Color", "tableberg"),
            "evenRowBackgroundColor"
        ),
        oddRowBackgroundColorControl: createControlProps(
            __("Odd Row Background Color", "tableberg"),
            "oddRowBackgroundColor"
        ),
        footerBackgroundColorControl: tableConfig.footerEnabled
            ? createControlProps(
                  __("Footer Background Color", "tableberg"),
                  "footerBackgroundColor"
              )
            : null,
    };
}
