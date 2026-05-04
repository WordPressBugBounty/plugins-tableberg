<?php

namespace Tableberg\Renderer\ListEl;

use Tableberg\Renderer\Attrs\NumberAttr;
use Tableberg\Renderer\Attrs\SvgIconAttrs;
use Tableberg\Renderer\Attrs\StringAttr;

use function Tableberg\Renderer\getOrNull;

class ListAttrs {
    /** @var StringAttr */
    public $align;

    /** @var array<int, ListItemAttrs> */
    public $items;

    /** @var StringAttr */
    public $listType;

    /** @var StringAttr */
    public $listStyle;

    /** @var ListIconAttrs|null */
    public $icon;

    /** @var ListStyles */
    public $styles;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();

        $defaultItems = getOrNull($defaults['items']);
        $defaultIcon = getOrNull($defaults['icon']);

        $instance = new self();
        $instance->align = new StringAttr(
            getOrNull($data['align']),
            $defaults['align'],
            ['left', 'center', 'right']
        );
        $instance->items = self::parse_items(getOrNull($data['items']), $defaultItems);
        $instance->listType = new StringAttr(
            getOrNull($data['listType']),
            $defaults['listType'],
            ['basic', 'styled']
        );
        $instance->listStyle = new StringAttr(
            getOrNull($data['listStyle']),
            $defaults['listStyle'],
            ['disc', 'circle', 'square', 'decimal', 'none']
        );

        if (array_key_exists('icon', $data) && $data['icon'] === null) {
            $instance->icon = null;
        } else {
            $iconData = getOrNull($data['icon']);
            if (!is_array($iconData)) {
                $iconData = $defaultIcon;
            }

            $instance->icon = ListIconAttrs::from_array($iconData);
        }

        $instance->styles = ListStyles::from_array(getOrNull($data['styles']));

        return $instance;
    }

    /**
     * @param array<mixed>|null $data
     * @param array<mixed>|null $defaults
     * @return array<int, ListItemAttrs>
     */
    private static function parse_items($data, $defaults) {
        $defaultItem = $defaults[0];

        $items = [];

        if (is_array($data)) {
            foreach ($data as $itemData) {
                if (!is_array($itemData)) {
                    continue;
                }

                $items[] = ListItemAttrs::from_array($itemData, $defaultItem);
            }
        }

        if (!empty($items)) {
            return $items;
        }

        return [ListItemAttrs::from_array($defaultItem, $defaultItem)];
    }
}

class ListItemAttrs {
    /** @var StringAttr */
    public $content;

    /** @var NumberAttr */
    public $indentLevel;

    /**
     * @param array<string, mixed>|null $data
     * @param array<string, mixed> $defaults
     * @return self
     */
    public static function from_array($data, $defaults = ['content' => '', 'indentLevel' => 0]) {
        $data = is_array($data) ? $data : [];

        $defaultContent = getOrNull($defaults['content']);
        $defaultIndentLevel = getOrNull($defaults['indentLevel']);

        $instance = new self();
        $instance->content = new StringAttr(
            getOrNull($data['content']),
            $defaultContent
        );
        $instance->indentLevel = new NumberAttr(
            getOrNull($data['indentLevel']),
            $defaultIndentLevel
        );

        return $instance;
    }
}

class ListIconAttrs {
    /** @var StringAttr */
    public $iconName;

    /** @var SvgIconAttrs|null */
    public $svg;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();
        $d = getOrNull($defaults['icon']);

        $defaultIconName = getOrNull($d['iconName']);
        $defaultSvg = getOrNull($d['svg']);

        $instance = new self();
        $instance->iconName = new StringAttr(
            getOrNull($data['iconName']),
            $defaultIconName
        );

        if (array_key_exists('svg', $data) && $data['svg'] === null) {
            $instance->svg = null;
            return $instance;
        }

        $svgData = getOrNull($data['svg']);
        if (!is_array($svgData)) {
            $svgData = $defaultSvg;
        }

        $checkSvgViewbox = '0 0 24 24';
        $checkSvgPath = 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z';

        $instance->svg = is_array($svgData)
            ? SvgIconAttrs::from_array(
                $svgData,
                $defaultSvg,
                $checkSvgViewbox,
                $checkSvgPath
            )
            : null;

        return $instance;
    }
}

class ListStyles {
    /** @var StringAttr */
    public $itemSpacing;

    /** @var StringAttr */
    public $iconColor;

    /** @var StringAttr */
    public $iconSize;

    /** @var StringAttr */
    public $iconSpacing;

    /** @var StringAttr */
    public $fontSize;

    /** @var StringAttr */
    public $textColor;

    /** @var StringAttr */
    public $linkColor;

    /** @var StringAttr */
    public $backgroundColor;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();
        $d = getOrNull($defaults['styles']);

        $defaultItemSpacing = getOrNull($d['itemSpacing']);
        $defaultIconColor = getOrNull($d['iconColor']);
        $defaultIconSize = getOrNull($d['iconSize']);
        $defaultIconSpacing = getOrNull($d['iconSpacing']);
        $defaultFontSize = getOrNull($d['fontSize']);
        $defaultTextColor = getOrNull($d['textColor']);
        $defaultLinkColor = getOrNull($d['linkColor']);
        $defaultBackgroundColor = getOrNull($d['backgroundColor']);

        $instance = new self();
        $instance->itemSpacing = new StringAttr(
            getOrNull($data['itemSpacing']),
            $defaultItemSpacing
        );
        $instance->iconColor = new StringAttr(
            getOrNull($data['iconColor']),
            $defaultIconColor
        );
        $instance->iconSize = new StringAttr(
            getOrNull($data['iconSize']),
            $defaultIconSize
        );
        $instance->iconSpacing = new StringAttr(
            getOrNull($data['iconSpacing']),
            $defaultIconSpacing
        );
        $instance->fontSize = new StringAttr(
            getOrNull($data['fontSize']),
            $defaultFontSize
        );
        $instance->textColor = new StringAttr(
            getOrNull($data['textColor']),
            $defaultTextColor
        );
        $instance->linkColor = new StringAttr(
            getOrNull($data['linkColor']),
            $defaultLinkColor
        );
        $instance->backgroundColor = new StringAttr(
            getOrNull($data['backgroundColor']),
            $defaultBackgroundColor
        );

        return $instance;
    }
}
