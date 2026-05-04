<?php

namespace Tableberg\Renderer\Image;

class ImageRenderer {
    /**
     * @param array<string, mixed>|null $attributes
     * @return string
     */
    public function render($attributes) {
        $attrs = ImageAttrs::from_array($attributes);

        $imageUrl = $attrs->media->url->asUrl();

        $sizeSlug = $attrs->sizeSlug->asText();
        if ($sizeSlug !== '') {
            $sizeData = $attrs->media->sizes[$sizeSlug] ?? null;

            if (
                $sizeData instanceof MediaSizeAttrs &&
                $sizeData->url->isNotEmpty()
            ) {
                $url = $sizeData->url->asUrl();
                if ($url !== '') {
                    $imageUrl = $url;
                }
            }
        }

        if ($imageUrl === '') {
            return '';
        }

        $imageStyles = ['display:block'];
        if ($attrs->aspectRatio->isNotEmpty()) {
            $imageStyles[] = 'aspect-ratio:' . $attrs->aspectRatio->asAttr();
        }
        if ($attrs->scale->isNotEmpty()) {
            $imageStyles[] = 'object-fit:' . $attrs->scale->asAttr();
        }
        if ($attrs->width->isNotEmpty()) {
            $imageStyles[] = 'width:' . $attrs->width->asAttr();
        }
        if ($attrs->height->isNotEmpty()) {
            $imageStyles[] = 'height:' . $attrs->height->asAttr();
        }
        if ($attrs->border->top->isNotEmpty()) {
            $imageStyles[] = 'border-top:' . $attrs->border->top->asAttr();
        }
        if ($attrs->border->right->isNotEmpty()) {
            $imageStyles[] = 'border-right:' . $attrs->border->right->asAttr();
        }
        if ($attrs->border->bottom->isNotEmpty()) {
            $imageStyles[] = 'border-bottom:' . $attrs->border->bottom->asAttr();
        }
        if ($attrs->border->left->isNotEmpty()) {
            $imageStyles[] = 'border-left:' . $attrs->border->left->asAttr();
        }
        if ($attrs->borderRadius->topLeft->isNotEmpty()) {
            $imageStyles[] = 'border-top-left-radius:' . $attrs->borderRadius->topLeft->asAttr();
        }
        if ($attrs->borderRadius->topRight->isNotEmpty()) {
            $imageStyles[] = 'border-top-right-radius:' . $attrs->borderRadius->topRight->asAttr();
        }
        if ($attrs->borderRadius->bottomLeft->isNotEmpty()) {
            $imageStyles[] = 'border-bottom-left-radius:' . $attrs->borderRadius->bottomLeft->asAttr();
        }
        if ($attrs->borderRadius->bottomRight->isNotEmpty()) {
            $imageStyles[] = 'border-bottom-right-radius:' . $attrs->borderRadius->bottomRight->asAttr();
        }

        $alt = $attrs->alt->isNotEmpty() ? $attrs->alt->asAttr() : $attrs->media->alt->asAttr();

        $imageStyleString = \esc_attr(implode(';', $imageStyles));

        $imgHtml =
            "<img
                src='{$imageUrl}'
                alt='{$alt}'
                style='{$imageStyleString}'
            />";

        if ($attrs->href->isNotEmpty()) {
            $target = $attrs->linkTarget->asAttr();
            $href = $attrs->href->asUrl();
            $relAttr = $target === '_blank' ? "rel='noopener noreferrer'" : '';

            $imgHtml =
                "<a
                    href='{$href}'
                    target='{$target}'
                    {$relAttr}
                >
                    {$imgHtml}
                </a>";
        }

        $captionHtml = '';
        if ($attrs->caption->isNotEmpty()) {
            $caption = $attrs->caption->asHtml();

            $captionHtml =
                "<figcaption class='tableberg-image-caption'>
                    {$caption}
                </figcaption>";
        }

        return
            "<figure
                class='tableberg-image-element'
                style='margin:0;line-height:1'
            >
                {$imgHtml}
                {$captionHtml}
            </figure>";
    }
}
