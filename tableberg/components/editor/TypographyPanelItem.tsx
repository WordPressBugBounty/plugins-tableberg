import { ReactNode } from "react";
import { useBlockEditContext } from "@wordpress/block-editor";
import { __experimentalToolsPanelItem as ToolsPanelItem } from "@wordpress/components";

/**
 * What every typography control below takes. The value is the plain CSS value
 * the control edits, so a block can keep it wherever its attributes live.
 */
export interface TypographyControlProps {
    label?: string;
    value: string;
    onChange: (newValue: string) => void;
    /** Defaults to clearing the value. */
    onDeselect?: () => void;
    resetAllFilter?: () => void;
    isShownByDefault?: boolean;
    /** Half width, so two controls sit side by side. */
    isSingleColumn?: boolean;
    /** Defaults to the block being edited. */
    panelId?: string;
}

interface Props {
    label: string;
    hasValue: () => boolean;
    onDeselect: () => void;
    resetAllFilter?: () => void;
    isShownByDefault?: boolean;
    isSingleColumn?: boolean;
    panelId?: string;
    children: ReactNode;
}

/**
 * The ToolsPanel plumbing the typography controls share: the menu entry, its
 * reset and the two-column layout.
 */
export default function TypographyPanelItem({
    label,
    hasValue,
    onDeselect,
    resetAllFilter,
    isShownByDefault = false,
    isSingleColumn = false,
    panelId,
    children,
}: Props) {
    const { clientId } = useBlockEditContext();

    return (
        <ToolsPanelItem
            panelId={panelId ?? clientId}
            className={isSingleColumn ? "single-column" : undefined}
            label={label}
            hasValue={hasValue}
            onDeselect={onDeselect}
            resetAllFilter={resetAllFilter ?? onDeselect}
            isShownByDefault={isShownByDefault}
        >
            {children}
        </ToolsPanelItem>
    );
}
