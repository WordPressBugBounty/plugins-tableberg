<?php

namespace Tableberg\Renderer\Text;

class TextRenderer {
    /**
     * @param array<string, mixed>|null $attributes
     * @return string
     */
    public function render($attributes) {
        $attrs = TextAttrs::from_array($attributes);

        $marginShorthand = $this->sides_shorthand($attrs->styles->margin);
        $paddingShorthand = $this->sides_shorthand($attrs->styles->padding);

        $styleValues = [];
        $styleValues[] = 'margin:' . ($marginShorthand !== '' ? $marginShorthand : '0');
        if ($paddingShorthand !== '') {
            $styleValues[] = 'padding:' . $paddingShorthand;
        }

        $styleValues[] = 'text-align:' . $attrs->align->asAttr();

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

    /**
     * Build a CSS shorthand from a 4-side value; returns '' when all sides
     * are empty so the property can be skipped.
     *
     * @param Sides $sides
     * @return string
     */
    private function sides_shorthand($sides) {
        $top = $sides->top->isNotEmpty() ? $sides->top->asAttr() : '0';
        $right = $sides->right->isNotEmpty() ? $sides->right->asAttr() : '0';
        $bottom = $sides->bottom->isNotEmpty() ? $sides->bottom->asAttr() : '0';
        $left = $sides->left->isNotEmpty() ? $sides->left->asAttr() : '0';

        if ($top === '0' && $right === '0' && $bottom === '0' && $left === '0') {
            return '';
        }

        return "{$top} {$right} {$bottom} {$left}";
    }
}
