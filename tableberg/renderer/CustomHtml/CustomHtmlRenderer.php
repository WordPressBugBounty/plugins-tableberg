<?php

namespace Tableberg\Renderer\CustomHtml;

class CustomHtmlRenderer {
    public function render($attributes) {
        $attrs = CustomHtmlAttrs::from_array($attributes);

        return
            "<div class='tableberg-custom-html'>
                {$attrs->content->asHtml()}
            </div>";
    }
}
