<?php

namespace Tableberg\Renderer\Text;

class TextRenderer {
    /**
     * @param array<string, mixed>|null $attributes
     * @return string
     */
    public function render($attributes) {
        $attrs = TextAttrs::from_array($attributes);

        $styleValues = ['margin:0'];

        if ($attrs->styles->textColor->isNotEmpty()) {
            $styleValues[] = 'color:' . $attrs->styles->textColor->asAttr();
        }

        if ($attrs->styles->linkColor->isNotEmpty()) {
            $styleValues[] = '--tableberg-text-link-color:' . $attrs->styles->linkColor->asAttr();
        }

        if ($attrs->styles->backgroundColor->isNotEmpty()) {
            $styleValues[] = 'background-color:' . $attrs->styles->backgroundColor->asAttr();
        }

        if ($attrs->styles->fontSize->isNotEmpty()) {
            $styleValues[] = 'font-size:' . $attrs->styles->fontSize->asAttr();
        }

        $styleAttr = implode(';', $styleValues);

        return
            "<p class='tableberg-text-element' style='{$styleAttr}'>
                {$attrs->content->asHtml()}
            </p>";
    }
}
