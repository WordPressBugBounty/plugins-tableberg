<?php

namespace Tableberg\Renderer\Icon;

use Tableberg\Renderer\Attrs\SvgIconAttrs;

class IconRenderer {
    /**
     * @param array<string, mixed>|null $attributes
     * @return string
     */
    public function render($attributes) {
        $attrs = IconAttrs::from_array($attributes);

        $className = 'tableberg-icon';
        if ($attrs->behavior->equals('char')) {
            $className .= ' tableberg-icon-as-char';
        }

        $wrapperStyles = [
            'padding-top:' . $attrs->styles->padding->top->asAttr(),
            'padding-right:' . $attrs->styles->padding->right->asAttr(),
            'padding-bottom:' . $attrs->styles->padding->bottom->asAttr(),
            'padding-left:' . $attrs->styles->padding->left->asAttr(),
        ];

        if ($attrs->styles->background->isNotEmpty()) {
            $wrapperStyles[] = 'background:' . $attrs->styles->background->asAttr();
        }
        if ($attrs->styles->rotation->value() != 0) {
            $wrapperStyles[] = 'transform:rotate(' . $attrs->styles->rotation->asAttr() . 'deg)';
        }
        if ($attrs->styles->border->top->isNotEmpty()) {
            $wrapperStyles[] = 'border-top:' . $attrs->styles->border->top->asAttr();
        }
        if ($attrs->styles->border->right->isNotEmpty()) {
            $wrapperStyles[] = 'border-right:' . $attrs->styles->border->right->asAttr();
        }
        if ($attrs->styles->border->bottom->isNotEmpty()) {
            $wrapperStyles[] = 'border-bottom:' . $attrs->styles->border->bottom->asAttr();
        }
        if ($attrs->styles->border->left->isNotEmpty()) {
            $wrapperStyles[] = 'border-left:' . $attrs->styles->border->left->asAttr();
        }
        if ($attrs->styles->borderRadius->topLeft->isNotEmpty()) {
            $wrapperStyles[] = 'border-top-left-radius:' . $attrs->styles->borderRadius->topLeft->asAttr();
        }
        if ($attrs->styles->borderRadius->topRight->isNotEmpty()) {
            $wrapperStyles[] = 'border-top-right-radius:' . $attrs->styles->borderRadius->topRight->asAttr();
        }
        if ($attrs->styles->borderRadius->bottomRight->isNotEmpty()) {
            $wrapperStyles[] = 'border-bottom-right-radius:' . $attrs->styles->borderRadius->bottomRight->asAttr();
        }
        if ($attrs->styles->borderRadius->bottomLeft->isNotEmpty()) {
            $wrapperStyles[] = 'border-bottom-left-radius:' . $attrs->styles->borderRadius->bottomLeft->asAttr();
        }

        if ($attrs->styles->colorHover->isNotEmpty()) {
            $wrapperStyles[] = '--tableberg-icon-color-hover:' . $attrs->styles->colorHover->asAttr();
        } elseif ($attrs->styles->color->isNotEmpty()) {
            $wrapperStyles[] = '--tableberg-icon-color-hover:' . $attrs->styles->color->asAttr();
        }

        if ($attrs->styles->backgroundHover->isNotEmpty()) {
            $wrapperStyles[] = '--tableberg-icon-bg-hover:' . $attrs->styles->backgroundHover->asAttr();
        } elseif ($attrs->styles->background->isNotEmpty()) {
            $wrapperStyles[] = '--tableberg-icon-bg-hover:' . $attrs->styles->background->asAttr();
        }

        $size = $attrs->size->asAttr();

        $iconHtml = '';
        if ($attrs->icon->svg instanceof SvgIconAttrs) {
            $svgStyles = [];
            if ($attrs->styles->color->isNotEmpty()) {
                $svgStyles[] = 'fill:' . $attrs->styles->color->asAttr();
            }

            $svgStyleAttr = '';
            if (!empty($svgStyles)) {
                $svgStyleAttr = " style='" . implode(';', $svgStyles) . "'";
            }

            $iconHtml =
                "<svg
                    viewBox='{$attrs->icon->svg->viewBox->asAttr()}'
                    xmlns='http://www.w3.org/2000/svg'
                    height='{$size}'
                    width='{$size}'
                    {$svgStyleAttr}
                >
                    <path d='{$attrs->icon->svg->path->asAttr()}' />
                </svg>";
        }

        if ($attrs->icon->url->isNotEmpty()) {
            $iconHtml =
                "<img
                    src='{$attrs->icon->url->asUrl()}'
                    alt=''
                    style='height:{$size};width:{$size}'
                />";
        }

        if ($attrs->link->url->isNotEmpty()) {
            $target = $attrs->link->target->asAttr();
            $relAttr = $attrs->link->target->equals('_blank')
                ? " rel='noopener noreferrer'"
                : '';

            $iconHtml =
                "<a
                    href='{$attrs->link->url->asUrl()}'
                    target='{$target}'
                    {$relAttr}
                >
                    {$iconHtml}
                </a>";
        }

        $stylesString = implode(';', $wrapperStyles);

        return
            "<div
                class='{$className}'
                style='{$stylesString}'
            >
                {$iconHtml}
            </div>";
    }
}
