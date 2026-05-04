<?php

namespace Tableberg\Renderer\CustomHtml;

use Tableberg\Renderer\Attrs\StringAttr;

use function Tableberg\Renderer\getOrNull;

class CustomHtmlAttrs {
    /** @var StringAttr */
    public $content;

    /** @var StringAttr */
    public $align;

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

        return $instance;
    }
}
