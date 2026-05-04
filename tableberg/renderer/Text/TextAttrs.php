<?php

namespace Tableberg\Renderer\Text;

use Tableberg\Renderer\Attrs\StringAttr;

use function Tableberg\Renderer\getOrNull;

class TextAttrs {
    /** @var StringAttr */
    public $content;

    /** @var StringAttr */
    public $align;

    /** @var TextStyles */
    public $styles;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();

        $instance = new self();
        $instance->content = new StringAttr(
            getOrNull($data['content']),
            $defaults['content']
        );
        $instance->align = new StringAttr(
            getOrNull($data['align']),
            $defaults['align'],
            ['left', 'center', 'right']
        );
        $instance->styles = TextStyles::from_array(getOrNull($data['styles']));

        return $instance;
    }
}

class TextStyles {
    /** @var StringAttr */
    public $textColor;

    /** @var StringAttr */
    public $linkColor;

    /** @var StringAttr */
    public $backgroundColor;

    /** @var StringAttr */
    public $fontSize;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();
        $d = getOrNull($defaults['styles']);

        $defaultTextColor = getOrNull($d['textColor']);
        $defaultLinkColor = getOrNull($d['linkColor']);
        $defaultBackgroundColor = getOrNull($d['backgroundColor']);
        $defaultFontSize = getOrNull($d['fontSize']);

        $instance = new self();
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
        $instance->fontSize = new StringAttr(
            getOrNull($data['fontSize']),
            $defaultFontSize
        );

        return $instance;
    }
}
