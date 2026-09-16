/**
 * WordPress Dependencies
 */
import classnames from "classnames";
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { map, isEmpty, debounce } from "lodash";
import { useState, useEffect } from "react";
/**
 * Custom Imports
 */
import { tablebergIcons } from "./icons";
import type { IconsLibraryProps, IconSvgData } from "./";

export interface IconsLibraryContentProps extends IconsLibraryProps {
    search: string;
    subCategoryFilter: string;
    mainCategoryFilter: string;
}

function extractSvgData(icon: JSX.Element): IconSvgData {
    const props = icon.props as {
        viewBox?: string;
        children?: { props?: { d?: string } };
    };
    return {
        viewBox: props.viewBox ?? "0 0 24 24",
        path: props.children?.props?.d ?? "",
    };
}

const debouncedSetValue = debounce((val, setVal) => {
    setVal(val);
}, 500);
function Content(props: IconsLibraryContentProps) {
    const [icons, setIcons] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { value, search, onSelect, subCategoryFilter, mainCategoryFilter } =
        props;

    const mergeIcons = (filteredIcons: any) => {
        let finalIcons = [];
        for (let i = 0; i < filteredIcons.length; i++) {
            finalIcons.push(...filteredIcons[i]);
        }
        return finalIcons;
    };
    useEffect(() => {
        const iconObj = tablebergIcons.find(
            obj => obj.type === mainCategoryFilter
        );
        if (search.trim() === "") {
            const preparedIcons = iconObj?.icons.filter(icon => {
                return icon?.categories?.includes(subCategoryFilter);
            });
            if (subCategoryFilter.includes("all-")) {
                setIcons(iconObj?.icons as any);
            } else {
                setIcons(preparedIcons as any);
            }
        } else {
            const preparedIcons = tablebergIcons.map(iconPack => {
                const iconPackIcons = iconPack?.icons.filter(icon => {
                    return icon?.title
                        .toLocaleLowerCase()
                        .trim()
                        ?.includes(search.toLocaleLowerCase().trim());
                });
                return iconPackIcons;
            });
            setIcons(mergeIcons(preparedIcons) as any);
        }
    }, [subCategoryFilter, mainCategoryFilter, debouncedSearch]);
    useEffect(() => {
        debouncedSetValue(search, setDebouncedSearch);
    }, [search]);

    const isNoResults = isEmpty(icons);

    return (
        <div className="tableberg_icon_library_content_wrapper">
            <div
                key={debouncedSearch}
                className={classnames("tableberg_icon_library_content", {
                    "no-results": isNoResults,
                })}
            >
                {map(icons, (icon: any) => {
                    return (
                        <Button
                            key={icon?.name}
                            className={`tableberg_icon_library_item`}
                            onClick={() =>
                                onSelect({
                                    iconName: icon.name,
                                    svg: extractSvgData(icon.icon),
                                })
                            }
                            isPressed={icon?.name === value}
                        >
                            <span className="tableberg_icon_list_item">
                                {icon.icon}
                            </span>
                            <span className="tableberg_list_item_title">
                                {icon?.title ?? icon?.name}
                            </span>
                        </Button>
                    );
                })}
                {isNoResults && <p>{__("No icons found.", "tableberg")}</p>}
            </div>
        </div>
    );
}

export default Content;
