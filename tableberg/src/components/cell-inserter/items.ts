import { ReactNode } from "react";
import textBlockIcon from "@tableberg/shared/icons/text";
import buttonBlockIcon from "@tableberg/shared/icons/button";
import imageBlockIcon from "@tableberg/shared/icons/image";
import StyledListIcon from "@tableberg/shared/icons/styled-list";
import HtmlIcon from "@tableberg/shared/icons/html";
import IconIcon from "@tableberg/shared/icons/icon";
import StarRatingIcon from "@tableberg/shared/icons/star-rating";
import { ElementTypes } from "../../attributes";
import { getExtendedElementDefinitions } from "../../extensions";
import { isProAvailable } from "../../pro-status";

export interface InserterItem {
    name: ElementTypes;
    title: string;
    icon: ReactNode;
    disabled?: boolean;
    isLocked?: boolean;
    upsellSelected?: string;
}

const baseCellInserterItems: InserterItem[] = [
    { name: "text", title: "Text", icon: textBlockIcon },
    { name: "button", title: "Button", icon: buttonBlockIcon },
    { name: "image", title: "Image", icon: imageBlockIcon },
    { name: "list", title: "List", icon: StyledListIcon },
];

export function getCellInserterItems(): InserterItem[] {
    const lockedProItems: InserterItem[] = isProAvailable()
        ? []
        : [
              {
                  name: "styled-list" as ElementTypes,
                  title: "Styled List",
                  icon: StyledListIcon,
                  isLocked: true,
                  upsellSelected: "tableberg/styled-list",
              },
              {
                  name: "icon" as ElementTypes,
                  title: "Icon",
                  icon: IconIcon,
                  isLocked: true,
                  upsellSelected: "tableberg/icon",
              },
              {
                  name: "star-rating" as ElementTypes,
                  title: "Star Rating",
                  icon: StarRatingIcon,
                  isLocked: true,
                  upsellSelected: "tableberg/star-rating",
              },
              {
                  name: "custom-html" as ElementTypes,
                  title: "Custom HTML",
                  icon: HtmlIcon,
                  isLocked: true,
                  upsellSelected: "tableberg/html",
              },
          ];

    return [
        ...baseCellInserterItems,
        ...lockedProItems,
        ...getExtendedElementDefinitions().map(definition => ({
            name: definition.name as ElementTypes,
            title: definition.title,
            icon: definition.icon,
        })),
    ];
}

export const cellInserterItems = getCellInserterItems();
