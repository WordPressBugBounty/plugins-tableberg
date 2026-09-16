import { InspectorControls } from "@wordpress/block-editor";
import {
    BaseControl,
    Button,
    ButtonGroup,
    __experimentalNumberControl as NumberControl,
    PanelBody,
    SelectControl,
    ToggleControl,
} from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { desktop, mobile, tablet } from "@wordpress/icons";
import LockedControl from "../LockedControl";
import {
    attrDefaults,
    ResponsiveBreakpoint,
    ResponsiveConfig,
    ResponsiveMode,
} from "../../attributes";
import { isProAvailable } from "../../pro-status";
import { useTableStore } from "../../store";

import "./style.scss";

type ResponsiveDevice = "desktop" | "tablet" | "mobile";

type ResponsivePreviewStore = {
    getDeviceType?: () => string;
    __experimentalGetPreviewDeviceType?: () => string;
};

type CoreEditorActions = {
    setDeviceType?: (device: string) => void;
};

type LegacyPreviewActions = {
    __experimentalSetPreviewDeviceType?: (device: string) => void;
};

const DEVICE_OPTIONS = [
    {
        value: "desktop",
        deviceType: "Desktop",
        label: __("Desktop", "tableberg"),
        icon: desktop,
    },
    {
        value: "tablet",
        deviceType: "Tablet",
        label: __("Tablet", "tableberg"),
        icon: tablet,
    },
    {
        value: "mobile",
        deviceType: "Mobile",
        label: __("Mobile", "tableberg"),
        icon: mobile,
    },
];

const tableConfigDefaults = attrDefaults.table;

const DEFAULT_RESPONSIVE_CONFIG =
    tableConfigDefaults.responsive as ResponsiveConfig;

const MODE_OPTIONS = [
    { value: "scroll", label: __("Scroll", "tableberg") },
    { value: "stack", label: __("Stack", "tableberg") },
];

function getDefaultBreakpoint(
    device: "tablet" | "mobile"
): ResponsiveBreakpoint {
    return { ...DEFAULT_RESPONSIVE_CONFIG[device] };
}

function getPreviewDeviceType(
    rawDeviceType: string | undefined
): ResponsiveDevice {
    const normalized = (rawDeviceType || "desktop").toLowerCase();

    if (normalized === "tablet") {
        return "tablet";
    }

    if (normalized === "mobile") {
        return "mobile";
    }

    return "desktop";
}

function normalizeBreakpoint(
    responsiveConfig: ResponsiveConfig | undefined,
    device: "tablet" | "mobile"
): ResponsiveBreakpoint {
    const defaults = getDefaultBreakpoint(device);
    const config = responsiveConfig?.[device] as
        | (Partial<ResponsiveBreakpoint> & {
              direction?: "row" | "col";
              headerAsCol?: boolean;
          })
        | undefined;

    const normalizedTranspose =
        typeof config?.transpose === "boolean"
            ? config.transpose
            : config?.direction === "row";

    const normalizedRepeatFirstCol =
        typeof config?.repeatFirstCol === "boolean"
            ? config.repeatFirstCol
            : !!config?.headerAsCol;

    return {
        ...defaults,
        ...(config || {}),
        transpose: normalizedTranspose,
        repeatFirstCol: normalizedRepeatFirstCol,
    };
}

export function ResponsiveControl() {
    const isPro = isProAvailable();
    const tableConfig = useTableStore(state => state.table);
    const updateTableConfig = useTableStore(state => state.updateTable);

    const previewDevice = useSelect(select => {
        const editorStore = select("core/editor") as ResponsivePreviewStore;
        const siteEditorStore = select(
            "core/edit-site"
        ) as ResponsivePreviewStore;
        const postEditorStore = select(
            "core/edit-post"
        ) as ResponsivePreviewStore;

        const rawDeviceType =
            editorStore?.getDeviceType?.() ||
            siteEditorStore?.__experimentalGetPreviewDeviceType?.() ||
            postEditorStore?.__experimentalGetPreviewDeviceType?.();

        return getPreviewDeviceType(rawDeviceType);
    }, []);

    const editorActions = useDispatch("core/editor") as CoreEditorActions;
    const siteEditorActions = useDispatch(
        "core/edit-site"
    ) as LegacyPreviewActions;
    const postEditorActions = useDispatch(
        "core/edit-post"
    ) as LegacyPreviewActions;

    const responsiveConfig = tableConfig.responsive;

    const applyBreakpointUpdates = (
        device: "tablet" | "mobile",
        updates: Partial<ResponsiveBreakpoint>
    ) => {
        const currentResponsive: ResponsiveConfig = {
            tablet: normalizeBreakpoint(responsiveConfig, "tablet"),
            mobile: normalizeBreakpoint(responsiveConfig, "mobile"),
        };

        updateTableConfig({
            responsive: {
                ...currentResponsive,
                [device]: {
                    ...currentResponsive[device],
                    ...updates,
                },
            },
        });
    };

    const setPreviewDevice = (deviceLabel: string) => {
        if (editorActions?.setDeviceType) {
            editorActions.setDeviceType(deviceLabel);
            return;
        }

        if (siteEditorActions?.__experimentalSetPreviewDeviceType) {
            siteEditorActions.__experimentalSetPreviewDeviceType(deviceLabel);
            return;
        }

        if (postEditorActions?.__experimentalSetPreviewDeviceType) {
            postEditorActions.__experimentalSetPreviewDeviceType(deviceLabel);
        }
    };

    const activeDevice = previewDevice === "desktop" ? "tablet" : previewDevice;
    const activeBreakpoint = normalizeBreakpoint(
        responsiveConfig,
        activeDevice
    );
    const controlsDisabled = !activeBreakpoint.enabled;

    return (
        <InspectorControls>
            <PanelBody title={__("Responsive", "tableberg")}>
                <BaseControl __nextHasNoMarginBottom>
                    <ButtonGroup className="tableberg-responsiveness-device-switcher-container">
                        {DEVICE_OPTIONS.map(
                            ({ value, deviceType, label, icon }) => (
                                <Button
                                    key={value}
                                    isPressed={previewDevice === value}
                                    icon={icon}
                                    className="tableberg-responsiveness-device-switcher"
                                    onClick={() => {
                                        setPreviewDevice(deviceType);
                                    }}
                                >
                                    {label}
                                </Button>
                            )
                        )}
                    </ButtonGroup>

                    {previewDevice === "desktop" ? (
                        <p style={{ margin: 0, color: "#757575" }}>
                            {__(
                                "Switch to Tablet or Mobile preview to configure responsive behavior.",
                                "tableberg"
                            )}
                        </p>
                    ) : (
                        <>
                            <ToggleControl
                                label={__(
                                    "Enable Responsive Rule",
                                    "tableberg"
                                )}
                                checked={activeBreakpoint.enabled}
                                onChange={enabled => {
                                    applyBreakpointUpdates(activeDevice, {
                                        enabled,
                                    });
                                }}
                            />

                            <NumberControl
                                label={__("Max Width", "tableberg")}
                                value={activeBreakpoint.maxWidth}
                                min={1}
                                suffix="px"
                                spinControls="none"
                                onChange={value => {
                                    const parsed = parseInt(value || "", 10);
                                    if (isNaN(parsed) || parsed < 1) {
                                        return;
                                    }

                                    applyBreakpointUpdates(activeDevice, {
                                        maxWidth: parsed,
                                    });
                                }}
                                disabled={controlsDisabled}
                                help={__(
                                    "The columns will be stacked when browser window width is less than this width",
                                    "tableberg"
                                )}
                            />

                            <SelectControl
                                label={__("Responsive Mode", "tableberg")}
                                value={activeBreakpoint.mode}
                                options={MODE_OPTIONS}
                                onChange={(mode: string) => {
                                    applyBreakpointUpdates(activeDevice, {
                                        mode: mode as ResponsiveMode,
                                    });
                                }}
                                disabled={controlsDisabled}
                                help={
                                    activeBreakpoint.mode === "scroll"
                                        ? __(
                                              "Makes the table horizontally scrollable",
                                              "tableberg"
                                          )
                                        : activeBreakpoint.mode === "stack"
                                          ? __(
                                                "Breaks the table by columns and stacks the columns",
                                                "tableberg"
                                            )
                                          : undefined
                                }
                            />

                            {activeBreakpoint.mode === "stack" && (
                                <>
                                    <ToggleControl
                                        label={__(
                                            "Transform Rows to Columns",
                                            "tableberg"
                                        )}
                                        checked={activeBreakpoint.transpose}
                                        onChange={transpose => {
                                            applyBreakpointUpdates(
                                                activeDevice,
                                                {
                                                    transpose,
                                                }
                                            );
                                        }}
                                        disabled={controlsDisabled}
                                    />

                                    {isPro ? (
                                        <ToggleControl
                                            label={__(
                                                "Show First Column in Every Stack Row",
                                                "tableberg"
                                            )}
                                            checked={
                                                activeBreakpoint.repeatFirstCol
                                            }
                                            onChange={repeatFirstCol => {
                                                applyBreakpointUpdates(
                                                    activeDevice,
                                                    {
                                                        repeatFirstCol,
                                                    }
                                                );
                                            }}
                                            disabled={controlsDisabled}
                                        />
                                    ) : (
                                        <LockedControl
                                            isEnhanced
                                            selected="sticky-first-col"
                                        >
                                            <ToggleControl
                                                label={__(
                                                    "Show First Column in Every Stack Row",
                                                    "tableberg"
                                                )}
                                                checked={false}
                                                onChange={() => null}
                                                disabled={controlsDisabled}
                                            />
                                        </LockedControl>
                                    )}

                                    <NumberControl
                                        label={__(
                                            "Items Per Stack Row",
                                            "tableberg"
                                        )}
                                        value={activeBreakpoint.stackCount}
                                        min={1}
                                        spinControls="none"
                                        help={__(
                                            "Maximum number of cells allowed in each stacked sub-row.",
                                            "tableberg"
                                        )}
                                        onChange={value => {
                                            const parsed = parseInt(
                                                value || "",
                                                10
                                            );
                                            if (isNaN(parsed) || parsed < 1) {
                                                return;
                                            }

                                            applyBreakpointUpdates(
                                                activeDevice,
                                                {
                                                    stackCount: parsed,
                                                }
                                            );
                                        }}
                                        disabled={controlsDisabled}
                                    />
                                </>
                            )}
                        </>
                    )}
                </BaseControl>
            </PanelBody>
        </InspectorControls>
    );
}
