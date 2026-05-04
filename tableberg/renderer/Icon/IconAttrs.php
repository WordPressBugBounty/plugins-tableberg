<?php

namespace Tableberg\Renderer\Icon;

use Tableberg\Renderer\Attrs\Corners;
use Tableberg\Renderer\Attrs\NumberAttr;
use Tableberg\Renderer\Attrs\Sides;
use Tableberg\Renderer\Attrs\SvgIconAttrs;
use Tableberg\Renderer\Attrs\StringAttr;

use function Tableberg\Renderer\getOrNull;

class IconAttrs {
    /** @var IconDataAttrs */
    public $icon;

    /** @var StringAttr */
    public $size;

    /** @var StringAttr */
    public $behavior;

    /** @var IconLinkAttrs */
    public $link;

    /** @var IconStyles */
    public $styles;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();

        $instance = new self();
        $instance->icon = IconDataAttrs::from_array(getOrNull($data['icon']));
        $instance->size = new StringAttr(getOrNull($data['size']), $defaults['size']);
        $instance->behavior = new StringAttr(
            getOrNull($data['behavior']),
            $defaults['behavior'],
            ['paragraph', 'char']
        );
        $instance->link = IconLinkAttrs::from_array(getOrNull($data['link']));
        $instance->styles = IconStyles::from_array(getOrNull($data['styles']));

        return $instance;
    }
}

class IconDataAttrs {
    /** @var StringAttr */
    public $iconName;

    /** @var SvgIconAttrs|null */
    public $svg;

    /** @var StringAttr */
    public $url;

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
        $defaultUrl = getOrNull($d['url']);

        $instance = new self();
        $instance->iconName = new StringAttr(
            getOrNull($data['iconName']),
            $defaultIconName
        );
        $instance->url = new StringAttr(
            getOrNull($data['url']),
            $defaultUrl
        );

        if (array_key_exists('svg', $data) && $data['svg'] === null) {
            $instance->svg = null;
            return $instance;
        }

        $svgData = getOrNull($data['svg']);
        if (!is_array($svgData)) {
            $svgData = $defaultSvg;
        }

        $instance->svg = is_array($svgData)
            ? SvgIconAttrs::from_array(
                $svgData,
                $defaultSvg,
                '0 0 512 512',
                'M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z'
            )
            : null;

        return $instance;
    }
}

class IconLinkAttrs {
    /** @var StringAttr */
    public $url;

    /** @var StringAttr */
    public $target;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();
        $d = getOrNull($defaults['link']);

        $defaultUrl = getOrNull($d['url']);
        $defaultTarget = getOrNull($d['target']);

        $instance = new self();
        $instance->url = new StringAttr(
            getOrNull($data['url']),
            $defaultUrl
        );
        $instance->target = new StringAttr(
            getOrNull($data['target']),
            $defaultTarget,
            ['_blank', '_self']
        );

        return $instance;
    }
}

class IconStyles {
    /** @var StringAttr */
    public $align;

    /** @var NumberAttr */
    public $rotation;

    /** @var StringAttr */
    public $color;

    /** @var StringAttr */
    public $colorHover;

    /** @var StringAttr */
    public $background;

    /** @var StringAttr */
    public $backgroundHover;

    /** @var Sides */
    public $padding;

    /** @var Sides */
    public $border;

    /** @var Corners */
    public $borderRadius;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();
        $d = getOrNull($defaults['styles']);

        $defaultAlign = getOrNull($d['align']);
        $defaultRotation = getOrNull($d['rotation']);
        $defaultColor = getOrNull($d['color']);
        $defaultColorHover = getOrNull($d['colorHover']);
        $defaultBackground = getOrNull($d['background']);
        $defaultBackgroundHover = getOrNull($d['backgroundHover']);
        $defaultPadding = getOrNull($d['padding']);
        $defaultBorder = getOrNull($d['border']);
        $defaultBorderRadius = getOrNull($d['borderRadius']);

        $instance = new self();
        $instance->align = new StringAttr(
            getOrNull($data['align']),
            $defaultAlign,
            ['left', 'center', 'right']
        );
        $instance->rotation = new NumberAttr(
            getOrNull($data['rotation']),
            $defaultRotation
        );
        $instance->color = new StringAttr(
            getOrNull($data['color']),
            $defaultColor
        );
        $instance->colorHover = new StringAttr(
            getOrNull($data['colorHover']),
            $defaultColorHover
        );
        $instance->background = new StringAttr(
            getOrNull($data['background']),
            $defaultBackground
        );
        $instance->backgroundHover = new StringAttr(
            getOrNull($data['backgroundHover']),
            $defaultBackgroundHover
        );
        $instance->padding = Sides::from_array(
            getOrNull($data['padding']),
            $defaultPadding
        );
        $instance->border = Sides::from_array(
            getOrNull($data['border']),
            $defaultBorder
        );
        $instance->borderRadius = Corners::from_array(
            getOrNull($data['borderRadius']),
            $defaultBorderRadius
        );

        return $instance;
    }
}
