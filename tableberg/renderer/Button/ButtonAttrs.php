<?php

namespace Tableberg\Renderer\Button;

use Tableberg\Renderer\Attrs\Corners;
use Tableberg\Renderer\Attrs\Sides;
use Tableberg\Renderer\Attrs\StringAttr;

use function Tableberg\Renderer\getOrNull;

class ButtonAttrs {
    /** @var StringAttr */
    public $content;

    /** @var StringAttr */
    public $id;

    /** @var StringAttr */
    public $align;

    /** @var LinkAttrs */
    public $link;

    /** @var ButtonStyles */
    public $styles;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();

        $instance = new self();
        $instance->content = new StringAttr(getOrNull($data['content']), $defaults['content']);
        $instance->id = new StringAttr(getOrNull($data['id']), $defaults['id']);
        $instance->align = new StringAttr(
            getOrNull($data['align']),
            $defaults['align'],
            ['left', 'center', 'right']
        );
        $instance->link = LinkAttrs::from_array(getOrNull($data['link']));
        $instance->styles = ButtonStyles::from_array(getOrNull($data['styles']));

        return $instance;
    }
}

class LinkAttrs {
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
        $d = $defaults['link'];

        $instance = new self();
        $instance->url = new StringAttr(getOrNull($data['url']), $d['url']);
        $instance->target = new StringAttr(
            getOrNull($data['target']),
            $d['target'],
            ['_blank', '_self']
        );

        return $instance;
    }
}

class ButtonStyles {
    /** @var StringAttr */
    public $backgroundColor;

    /** @var StringAttr */
    public $textColor;

    /** @var StringAttr */
    public $backgroundHoverColor;

    /** @var StringAttr */
    public $textHoverColor;

    /** @var StringAttr */
    public $textAlign;

    /** @var StringAttr */
    public $width;

    /** @var Sides */
    public $padding;

    /** @var Corners */
    public $borderRadius;

    /** @var StringAttr */
    public $fontSize;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();
        $d = $defaults['styles'];

        $instance = new self();
        $instance->backgroundColor = new StringAttr(
            getOrNull($data['backgroundColor']),
            $d['backgroundColor']
        );
        $instance->textColor = new StringAttr(getOrNull($data['textColor']), $d['textColor']);
        $instance->backgroundHoverColor = new StringAttr(
            getOrNull($data['backgroundHoverColor']),
            $d['backgroundHoverColor']
        );
        $instance->textHoverColor = new StringAttr(
            getOrNull($data['textHoverColor']),
            $d['textHoverColor']
        );
        $instance->textAlign = new StringAttr(
            getOrNull($data['textAlign']),
            $d['textAlign'],
            ['left', 'center', 'right']
        );
        $instance->width = new StringAttr(
            getOrNull($data['width']),
            $d['width'],
            ['auto', '25%', '50%', '75%', '100%']
        );
        $instance->padding = Sides::from_array(getOrNull($data['padding']), $d['padding']);
        $instance->borderRadius = Corners::from_array(
            getOrNull($data['borderRadius']),
            $d['borderRadius']
        );
        $instance->fontSize = new StringAttr(getOrNull($data['fontSize']), $d['fontSize']);

        return $instance;
    }
}
