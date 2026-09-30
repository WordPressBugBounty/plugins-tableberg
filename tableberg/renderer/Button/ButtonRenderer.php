<?php

namespace Tableberg\Renderer\Button;

class ButtonRenderer {
    /**
     * @param array<string, mixed>|null $attributes
     * @return string
     */
    public function render($attributes) {
        $attrs = ButtonAttrs::from_array($attributes);

        $backgroundColor = $attrs->styles->backgroundColor->asAttr();
        $textColor = $attrs->styles->textColor->asAttr();
        $backgroundHoverColor = $attrs->styles->backgroundHoverColor->isNotEmpty()
            ? $attrs->styles->backgroundHoverColor->asAttr()
            : $backgroundColor;
        $textHoverColor = $attrs->styles->textHoverColor->isNotEmpty()
            ? $attrs->styles->textHoverColor->asAttr()
            : $textColor;

        // Outline draws the button's colour as its text and border with
        // nothing behind it, the way the core Buttons block does; hover then
        // fills it in, which is where the text colour comes back.
        $isOutline = $attrs->styles->variant->equals('outline');

        $wrapperStyles = [
            'display:flex',
            'justify-content:' . $this->alignment_to_justify_content($attrs->align->asText()),
            '--tableberg-button-background-color:' . ($isOutline ? 'transparent' : $backgroundColor),
            '--tableberg-button-text-color:' . ($isOutline ? $backgroundColor : $textColor),
            '--tableberg-button-hover-background-color:' . $backgroundHoverColor,
            '--tableberg-button-text-hover-color:' . $textHoverColor,
        ];

        $buttonStyles = [
            'display:inline-block',
            'border:' . ($isOutline ? '2px solid ' . $backgroundColor : 'none'),
            'text-align:' . $attrs->styles->textAlign->asAttr(),
            'padding-top:' . $attrs->styles->padding->top->asAttr(),
            'padding-right:' . $attrs->styles->padding->right->asAttr(),
            'padding-bottom:' . $attrs->styles->padding->bottom->asAttr(),
            'padding-left:' . $attrs->styles->padding->left->asAttr(),
            'border-top-left-radius:' . $attrs->styles->borderRadius->topLeft->asAttr(),
            'border-top-right-radius:' . $attrs->styles->borderRadius->topRight->asAttr(),
            'border-bottom-right-radius:' . $attrs->styles->borderRadius->bottomRight->asAttr(),
            'border-bottom-left-radius:' . $attrs->styles->borderRadius->bottomLeft->asAttr(),
        ];

        // Without a size of its own the button takes the table's.
        if ($attrs->styles->fontSize->isNotEmpty()) {
            $buttonStyles[] = 'font-size:' . $attrs->styles->fontSize->asAttr();
        }

        $customWidth = $this->get_custom_width($attrs->styles->width->asText());

        if ($customWidth !== null) {
            $wrapperStyles[] = 'width:100%';
            $buttonStyles[] = 'width:100%';
        }

        $target = $attrs->link->target->asAttr();

        $buttonStyleString = implode(';', $buttonStyles);

        $buttonHtml = '';
        if ($attrs->link->url->isNotEmpty()) {
            $relAttr = $target === '_blank' ? ' rel="noopener noreferrer"' : '';

            $buttonHtml =
                "<a
                    class='wp-block-button__link wp-element-button'
                    href='{$attrs->link->url->asUrl()}'
                    target='{$target}'
                    {$relAttr}
                    style='{$buttonStyleString}'
                >
                    {$attrs->content->asHtml()}
                </a>";
        } else {
            $buttonHtml =
                "<div
                    class='wp-block-button__link wp-element-button'
                    style='{$buttonStyleString}'
                >
                    {$attrs->content->asHtml()}
                </div>";
        }

        if ($customWidth !== null) {
            $customWidthWrapperStyles = implode(';', [
                'width:' . $customWidth,
                'max-width:none',
                'min-width:0',
                $attrs->styles->width->asText() === '100%' ? 'flex-basis:100%' : null,
            ]);

            $buttonHtml =
                "<div style='{$customWidthWrapperStyles}'>
                    {$buttonHtml}
                </div>";
        }

        $wrapperStyleString = implode(';', $wrapperStyles);

        return
            "<div id='{$attrs->id->asAttr()}' style='{$wrapperStyleString}'>
                {$buttonHtml}
            </div>";
    }

    /**
     * @param string $align
     * @return string
     */
    private function alignment_to_justify_content($align) {
        if ($align === 'center') {
            return 'center';
        }

        if ($align === 'right') {
            return 'flex-end';
        }

        return 'flex-start';
    }

    /**
     * @param string $width
     * @return string|null
     */
    private function get_custom_width($width) {
        if ($width === '25%') {
            return 'calc(25% - (var(--wp--style--block-gap, 0.5em) * 0.75))';
        }

        if ($width === '50%') {
            return 'calc(50% - (var(--wp--style--block-gap, 0.5em) * 0.5))';
        }

        if ($width === '75%') {
            return 'calc(75% - (var(--wp--style--block-gap, 0.5em) * 0.25))';
        }

        if ($width === '100%') {
            return '100%';
        }

        return null;
    }
}
