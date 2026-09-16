import { useRef } from "react";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { mergeAttrsWithDefaultsAndApplyBindings } from "@tableberg/shared/utils/merge-attrs-with-defaults-and-apply-bindings";

import { useTableStore } from "../../store";
import { useClickOutside } from "../../hooks/useClickOutside";
import { ElementRendererProps } from "../index";
import { IconElementControls } from "./controls";
import { BindableAttribute, ElementBindings } from "../../dynamic-data/types";
import { useDynamicDataBindings } from "../../dynamic-data/hooks/useDynamicData";

export interface IconElementAttributes {
    icon: {
        iconName: string;
        svg?: {
            viewBox: string;
            path: string;
        };
        url?: string;
    };
    size: string;
    behavior: "paragraph" | "char";
    link: {
        url: string;
        target: "_blank" | "_self";
    };
    styles: {
        align: "left" | "center" | "right";
        rotation: number;
        color: string;
        colorHover: string;
        background: string;
        backgroundHover: string;
        padding: {
            top: string;
            right: string;
            bottom: string;
            left: string;
        };
        border: {
            top: string;
            right: string;
            bottom: string;
            left: string;
        };
        borderRadius: {
            topLeft: string;
            topRight: string;
            bottomRight: string;
            bottomLeft: string;
        };
    };
}

export const iconAttrDefaults: IconElementAttributes = {
    icon: {
        iconName: "check",
        svg: {
            viewBox: "0 0 512 512",
            path: "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z",
        },
    },
    size: "40px",
    behavior: "paragraph",
    link: {
        url: "",
        target: "_self",
    },
    styles: {
        align: "left",
        rotation: 0,
        color: "",
        colorHover: "",
        background: "",
        backgroundHover: "",
        padding: {
            top: "var(--wp--preset--spacing--20)",
            right: "var(--wp--preset--spacing--20)",
            bottom: "var(--wp--preset--spacing--20)",
            left: "var(--wp--preset--spacing--20)",
        },
        border: {
            top: "",
            right: "",
            bottom: "",
            left: "",
        },
        borderRadius: {
            topLeft: "",
            topRight: "",
            bottomLeft: "",
            bottomRight: "",
        },
    },
};

export interface IconElementType {
    name: "icon";
    attributes: IconElementAttributes;
    bindings?: ElementBindings;
}

export function IconElement({
    attributes,
    bindings,
    cellCoords,
    elementIndex,
}: ElementRendererProps<IconElementAttributes>) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const isElementSelected = useTableStore(state => state.isElementSelected);
    const setSelectedElement = useTableStore(state => state.setSelectedElement);
    const clearSelectedElement = useTableStore(
        state => state.clearSelectedElement
    );

    const isSelected = isElementSelected(cellCoords, elementIndex);

    useClickOutside({
        ref: wrapperRef,
        onClickOutside: () => {
            if (isSelected) {
                clearSelectedElement();
            }
        },
    });

    const { values: previewValues } = useDynamicDataBindings(bindings);

    const mergedAttrs = mergeAttrsWithDefaultsAndApplyBindings(
        attributes,
        iconAttrDefaults,
        bindings,
        previewValues,
        __("(No data)", "tableberg")
    );

    const { icon, size, behavior, link, styles } = mergedAttrs;

    const wrapperClassName = classNames("tableberg-icon", {
        "tableberg-icon-as-char": behavior === "char",
    });

    const wrapperStyle: Record<string, string | undefined> = {
        "background": styles.background || undefined,
        "transform": styles.rotation
            ? `rotate(${styles.rotation}deg)`
            : undefined,
        "paddingTop": styles.padding.top,
        "paddingRight": styles.padding.right,
        "paddingBottom": styles.padding.bottom,
        "paddingLeft": styles.padding.left,
        "borderTop": styles.border.top,
        "borderRight": styles.border.right,
        "borderBottom": styles.border.bottom,
        "borderLeft": styles.border.left,
        "borderTopLeftRadius": styles.borderRadius.topLeft,
        "borderTopRightRadius": styles.borderRadius.topRight,
        "borderBottomRightRadius": styles.borderRadius.bottomRight,
        "borderBottomLeftRadius": styles.borderRadius.bottomLeft,
        "--tableberg-icon-color-hover":
            styles.colorHover || styles.color || undefined,
        "--tableberg-icon-bg-hover":
            styles.backgroundHover || styles.background || undefined,
    };

    let iconContent: JSX.Element | null = null;

    if (icon.svg) {
        iconContent = (
            <svg
                viewBox={icon.svg.viewBox}
                xmlns="http://www.w3.org/2000/svg"
                height={size}
                width={size}
                style={{ fill: styles.color || undefined }}
            >
                <path d={icon.svg.path} />
            </svg>
        );
    }

    if (icon.url) {
        iconContent = (
            <img
                src={icon.url}
                alt=""
                style={{
                    height: size,
                    width: size,
                }}
            />
        );
    }

    const handleClick = () => {
        if (!sortPreviewMode) {
            setSelectedElement(cellCoords, elementIndex);
        }
    };

    return (
        <>
            {isSelected && (
                <IconElementControls
                    attributes={mergedAttrs}
                    bindings={bindings}
                    cellCoords={cellCoords}
                    elementIndex={elementIndex}
                />
            )}
            <div
                ref={wrapperRef}
                className={wrapperClassName}
                style={wrapperStyle}
                onClick={handleClick}
            >
                {link.url ? (
                    <a
                        href={link.url}
                        target={link.target}
                        rel={
                            link.target === "_blank"
                                ? "noopener noreferrer"
                                : undefined
                        }
                        onClick={e => e.preventDefault()}
                    >
                        {iconContent}
                    </a>
                ) : (
                    iconContent
                )}
            </div>
        </>
    );
}

export const iconBindableAttributes: BindableAttribute[] = [
    {
        path: "link.url",
        label: __("Link URL", "tableberg"),
    },
    {
        path: "styles.color",
        label: __("Icon Color", "tableberg"),
    },
    {
        path: "styles.background",
        label: __("Background Color", "tableberg"),
    },
];
