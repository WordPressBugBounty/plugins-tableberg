<?php

namespace Tableberg\Renderer\Cell;

use Tableberg\Renderer\Attrs\StringAttr;
use Tableberg\Renderer\Button\ButtonRenderer;
use Tableberg\Renderer\Image\ImageRenderer;
use Tableberg\Renderer\ListEl\ListRenderer;
use Tableberg\Renderer\Text\TextRenderer;

use function apply_filters;
use function Tableberg\Renderer\getArrayOrNull;
use function Tableberg\Renderer\getStringOrNull;

class CellRenderer {
    /**
     * @param CellRenderContext $context
     * @return string
     */
    public function render(CellRenderContext $context) {
        if (!$context->hasCellCoords) {
            return '';
        }

        $styleValues = [
            'paddingTop' => $context->paddingTop,
            'paddingRight' => $context->paddingRight,
            'paddingBottom' => $context->paddingBottom,
            'paddingLeft' => $context->paddingLeft,
            'orientation' => $context->orientation,
            'elementGap' => $context->elementGap,
            'wrap' => $context->wrap,
            'verticalAlign' => $context->verticalAlign,
            'backgroundColor' => $context->backgroundColor,
            'borderTop' => $context->borderTop,
            'borderRight' => $context->borderRight,
            'borderBottom' => $context->borderBottom,
            'borderLeft' => $context->borderLeft,
            'borderTopLeftRadius' => $context->borderTopLeftRadius,
            'borderTopRightRadius' => $context->borderTopRightRadius,
            'borderBottomRightRadius' => $context->borderBottomRightRadius,
            'borderBottomLeftRadius' => $context->borderBottomLeftRadius,
        ];

        $styleValues = $this->overrideStyles(
            $context->cellStyleOverride,
            $styleValues
        );

        // Pro styling of a single cell goes through one filter rather than
        // one per property, so a new pro style needs no change here. Pro
        // gets the styles free resolved plus every attribute of the cell,
        // and returns the ones it wants rendered.
        //
        // Applied after the `styles` overrides rather than inside them: a
        // cell can carry a pro attribute without any `styles` at all.
        $proStyleValues = apply_filters(
            'tableberg/cell_styles',
            $styleValues,
            $context->cellAttrs,
            $context
        );
        if (is_array($proStyleValues)) {
            // Merged, not replaced, so a filter that returns a partial set
            // cannot leave the renderer with missing keys.
            $styleValues = array_merge($styleValues, $proStyleValues);
        }

        if ($context->isEmpty) {
            // An "empty cell" renders as a bare, unstyled cell on the
            // frontend: no content, and no background/border either, so it
            // is indistinguishable from a cell that was never styled.
            $styleValues['backgroundColor'] = '';
            $styleValues['borderTop'] = '';
            $styleValues['borderRight'] = '';
            $styleValues['borderBottom'] = '';
            $styleValues['borderLeft'] = '';
            $styleValues['borderTopLeftRadius'] = '';
            $styleValues['borderTopRightRadius'] = '';
            $styleValues['borderBottomRightRadius'] = '';
            $styleValues['borderBottomLeftRadius'] = '';
        }

        $isStickyHeaderCell =
            $context->stickyHeader &&
            $context->row === 0 &&
            $context->tag === 'th';

        $isStickyFirstColCell =
            $context->stickyFirstCol && $context->col === 0;

        $styleParts = ['position:relative'];
        if ($styleValues['paddingTop'] !== '') {
            $styleParts[] = 'padding-top:' . $styleValues['paddingTop'];
        }
        if ($styleValues['paddingRight'] !== '') {
            $styleParts[] = 'padding-right:' . $styleValues['paddingRight'];
        }
        if ($styleValues['paddingBottom'] !== '') {
            $styleParts[] = 'padding-bottom:' . $styleValues['paddingBottom'];
        }
        if ($styleValues['paddingLeft'] !== '') {
            $styleParts[] = 'padding-left:' . $styleValues['paddingLeft'];
        }
        if ($styleValues['verticalAlign'] !== '') {
            $styleParts[] = 'vertical-align:' . $styleValues['verticalAlign'];
        }
        if ($styleValues['backgroundColor'] !== '') {
            $styleParts[] = 'background-color:' . $styleValues['backgroundColor'];
        }
        if ($styleValues['borderTop'] !== '') {
            $styleParts[] = 'border-top:' . $styleValues['borderTop'];
        }
        if ($styleValues['borderRight'] !== '') {
            $styleParts[] = 'border-right:' . $styleValues['borderRight'];
        }
        if ($styleValues['borderBottom'] !== '') {
            $styleParts[] = 'border-bottom:' . $styleValues['borderBottom'];
        }
        if ($styleValues['borderLeft'] !== '') {
            $styleParts[] = 'border-left:' . $styleValues['borderLeft'];
        }
        if ($styleValues['borderTopLeftRadius'] !== '') {
            $styleParts[] = 'border-top-left-radius:' . $styleValues['borderTopLeftRadius'];
        }
        if ($styleValues['borderTopRightRadius'] !== '') {
            $styleParts[] = 'border-top-right-radius:' . $styleValues['borderTopRightRadius'];
        }
        if ($styleValues['borderBottomRightRadius'] !== '') {
            $styleParts[] = 'border-bottom-right-radius:' . $styleValues['borderBottomRightRadius'];
        }
        if ($styleValues['borderBottomLeftRadius'] !== '') {
            $styleParts[] = 'border-bottom-left-radius:' . $styleValues['borderBottomLeftRadius'];
        }
        if ($context->colSpan === 1 && $context->width !== null && $context->width !== '') {
            $styleParts[] = 'width:' . $context->width;
            $styleParts[] = 'min-width:' . $context->width;
        }
        if ($context->rowSpan === 1 && $context->height !== null && $context->height !== '') {
            $styleParts[] = 'height:' . $context->height;
            $styleParts[] = 'min-height:' . $context->height;
        }

        if ($isStickyHeaderCell) {
            $styleParts[] = 'position:sticky';
            $styleParts[] = 'top:0';
            $styleParts[] = $isStickyFirstColCell ? 'z-index:3' : 'z-index:2';

            if ($styleValues['backgroundColor'] === '') {
                $styleParts[] = 'background-color:#fff';
            }
        }

        if ($isStickyFirstColCell) {
            if (!$isStickyHeaderCell) {
                $styleParts[] = 'position:sticky';
                $styleParts[] = 'z-index:1';
            }
            $styleParts[] = 'left:0';

            if (
                !$isStickyHeaderCell &&
                $styleValues['backgroundColor'] === ''
            ) {
                $styleParts[] = 'background-color:#fff';
            }
        }

        $tag = $context->tag === 'th' ? 'th' : 'td';
        $sortableType = getStringOrNull($context->sortableType);

        $buttonRenderer = new ButtonRenderer();
        $imageRenderer = new ImageRenderer();
        $listRenderer = new ListRenderer();
        $textRenderer = new TextRenderer();

        $elementsHtml = '';

        $isHorizontal = $styleValues['orientation'] === 'horizontal';
        $implicitAlignment = $this->getUniformElementsAlignment($context->elements);

        foreach ($context->elements as $element) {
            if (!is_object($element)) {
                continue;
            }

            $elementName = $element->name->asText();
            $name = getStringOrNull($elementName) ?? 'unknown';
            $attributes = is_array($element->attributes)
                ? $element->attributes
                : [];

            $elementHtml = '';

            if ($name === 'text') {
                $elementHtml = $textRenderer->render($attributes);
            }
            if ($name === 'button') {
                $elementHtml = $buttonRenderer->render($attributes);
            }
            if ($name === 'image') {
                $elementHtml = $imageRenderer->render($attributes);
            }
            if ($name === 'list') {
                $elementHtml = $listRenderer->render($attributes);
            }

            if ($elementHtml === '') {
                $elementHtml = apply_filters(
                    'tableberg/render_cell_element_html',
                    '',
                    $name,
                    $attributes,
                    $context
                );

                if (!is_string($elementHtml)) {
                    $elementHtml = '';
                }
            }

            if ($elementHtml === '') {
                $elementHtml =
                    "<div
                    class='tableberg-cell-element-placeholder'
                    data-element-name='$name'
                >
                    $name
                </div>";
            }

            $elementAlign = $this->getElementAlignment(
                $name,
                $attributes
            );
            $elementWrapperStyles = [
                'display:flex',
                'justify-content:' . $this->alignmentToJustifyContent($elementAlign),
            ];

            if (!$isHorizontal) {
                $elementWrapperStyles[] = 'width:100%';
            }

            $elementsHtml .=
                "<div
                    class='tableberg-cell-element'
                    style='" . implode(';', $elementWrapperStyles) . "'
                >
                    {$elementHtml}
                </div>";
        }

        $elementsWrapperClasses = ['tableberg-cell-elements'];
        $elementsWrapperStyleParts = ['display:flex'];

        if ($isHorizontal) {
            $elementsWrapperClasses[] = 'tableberg-cell-elements-horizontal';
        }

        $elementsWrapperStyleParts[] = 'flex-direction:' . ($isHorizontal ? 'row' : 'column');

        $verticalAlignFlex = 'center';
        if ($styleValues['verticalAlign'] === 'top') {
            $verticalAlignFlex = 'flex-start';
        } elseif ($styleValues['verticalAlign'] === 'bottom') {
            $verticalAlignFlex = 'flex-end';
        }

        if ($isHorizontal) {
            $elementsWrapperStyleParts[] =
                'justify-content:' .
                $this->alignmentToJustifyContent($implicitAlignment);
            $elementsWrapperStyleParts[] = 'align-items:' . $verticalAlignFlex;
        } else {
            $elementsWrapperStyleParts[] = 'justify-content:' . $verticalAlignFlex;
            $elementsWrapperStyleParts[] = 'align-items:stretch';
        }

        $elementsWrapperStyleParts[] =
            'flex-wrap:' . ($styleValues['wrap'] === 'nowrap' ? 'nowrap' : 'wrap');

        if ($styleValues['elementGap'] !== '') {
            $elementsWrapperStyleParts[] = 'gap:' . $styleValues['elementGap'];
        }

        $elementsWrapperClassAttr = implode(' ', $elementsWrapperClasses);
        $elementsWrapperStyleAttr = '';
        $elementsWrapperStyleAttr = "style='" . implode(';', $elementsWrapperStyleParts) . "'";

        $elementsWrapperHtml =
            "<div
                class='{$elementsWrapperClassAttr}'
                {$elementsWrapperStyleAttr}
            >
                {$elementsHtml}
            </div>";

        $ribbonHtml = apply_filters(
            'tableberg/render_cell_ribbon_html',
            '',
            $context->ribbon,
            $context
        );

        if (!is_string($ribbonHtml)) {
            $ribbonHtml = '';
        }

        $cellIsSortableHeader = $tag === 'th' && $sortableType !== null;
        $sortIndicatorHtml = $cellIsSortableHeader ?
            "<span
                class='tableberg-sort-indicator'
                aria-hidden='true'
            >
                &#9650;&#9660;
            </span>" : '';

        $stylesStr = implode(';', $styleParts);

        $attrsStr = ($tag === 'th' && $sortableType !== null) ?
                "data-sortable='{$sortableType}'
                role='button'
                tabindex='0'
                aria-sort='none'" : '';

        $classAttr = $context->className !== ''
            ? " class='" . \esc_attr($context->className) . "'"
            : '';

        $html =
            "<$tag
                rowspan='{$context->rowSpan}'
                colspan='{$context->colSpan}'
                {$classAttr}
                style='$stylesStr'
                data-cell-row='{$context->row}'
                data-cell-col='{$context->col}'
                {$attrsStr}
            >
                $elementsWrapperHtml
                $sortIndicatorHtml
                $ribbonHtml
            </$tag>";

        return $html;
    }

    /**
     * @param string $elementName
     * @param array<string, mixed> $attributes
     * @return string
     */
    private function getElementAlignment($elementName, $attributes) {
        if ($elementName === 'icon') {
            $styles = getArrayOrNull($attributes['styles']) ?? [];
            $styleAlign = getStringOrNull($styles['align']);
            if (in_array($styleAlign, ['left', 'center', 'right'], true)) {
                return $styleAlign;
            }

            return 'left';
        }

        $topLevelAlign = getStringOrNull($attributes['align']);
        if (in_array($topLevelAlign, ['left', 'center', 'right'], true)) {
            return $topLevelAlign;
        }

        return 'left';
    }

    /**
     * @param string $alignment
     * @return string
     */
    private function alignmentToJustifyContent($alignment) {
        if ($alignment === 'center') {
            return 'center';
        }

        if ($alignment === 'right') {
            return 'flex-end';
        }

        return 'flex-start';
    }

    /**
     * @param array<int, mixed> $elements
     * @return string
     */
    private function getUniformElementsAlignment($elements) {
        $resolvedAlignment = null;
        $hasElements = false;

        foreach ($elements as $element) {
            if (!is_object($element)) {
                continue;
            }

            $elementName = $element->name->asText();
            $name = getStringOrNull($elementName) ?? 'unknown';
            $attributes = is_array($element->attributes)
                ? $element->attributes
                : [];

            $currentAlignment = $this->getElementAlignment($name, $attributes);

            if (!$hasElements) {
                $resolvedAlignment = $currentAlignment;
                $hasElements = true;
                continue;
            }

            if ($resolvedAlignment !== $currentAlignment) {
                return 'left';
            }
        }

        return $hasElements ? $resolvedAlignment : 'left';
    }

    /**
     * @param array<string, StringAttr|array>|null $cellStyleOverride
     * @param array<string, string> $styleValues
     * @return array<string, string>
     */
    private function overrideStyles($cellStyleOverride, $styleValues) {
        if (!is_array($cellStyleOverride)) {
            return $styleValues;
        }

        $overridePadding = getArrayOrNull($cellStyleOverride['padding']);
        if (is_array($overridePadding)) {
            if (isset($overridePadding['top']) && $overridePadding['top'] instanceof StringAttr) {
                $styleValues['paddingTop'] = $overridePadding['top']->asAttr();
            }
            if (isset($overridePadding['right']) && $overridePadding['right'] instanceof StringAttr) {
                $styleValues['paddingRight'] = $overridePadding['right']->asAttr();
            }
            if (isset($overridePadding['bottom']) && $overridePadding['bottom'] instanceof StringAttr) {
                $styleValues['paddingBottom'] = $overridePadding['bottom']->asAttr();
            }
            if (isset($overridePadding['left']) && $overridePadding['left'] instanceof StringAttr) {
                $styleValues['paddingLeft'] = $overridePadding['left']->asAttr();
            }
        }

        if (isset($cellStyleOverride['orientation'])
            && $cellStyleOverride['orientation'] instanceof StringAttr) {
            $orientation = $cellStyleOverride['orientation']->asAttr();
            $styleValues['orientation'] = $orientation;
        }

        if (isset($cellStyleOverride['wrap'])
            && $cellStyleOverride['wrap'] instanceof StringAttr) {
            $wrap = $cellStyleOverride['wrap']->asAttr();
            $styleValues['wrap'] = $wrap;
        }

        if (isset($cellStyleOverride['elementGap'])
            && $cellStyleOverride['elementGap'] instanceof StringAttr) {
            $styleValues['elementGap'] = $cellStyleOverride['elementGap']->asAttr();
        }

        if (isset($cellStyleOverride['verticalAlign'])
            && $cellStyleOverride['verticalAlign'] instanceof StringAttr) {
            $verticalAlign = $cellStyleOverride['verticalAlign']->asAttr();
            $styleValues['verticalAlign'] = $verticalAlign;
        }

        // Border is a pro attribute now (moved off this shared `styles`
        // object, same as backgroundColor before it), resolved instead
        // through the `tableberg/cell_styles` filter below — not here, or
        // it would keep rendering a lapsed/legacy border regardless of
        // licence status.

        $overrideBorderRadius = getArrayOrNull($cellStyleOverride['borderRadius']);
        if (is_array($overrideBorderRadius)) {
            if (isset($overrideBorderRadius['topLeft'])
                && $overrideBorderRadius['topLeft'] instanceof StringAttr) {
                $styleValues['borderTopLeftRadius'] = $overrideBorderRadius['topLeft']->asAttr();
            }
            if (isset($overrideBorderRadius['topRight'])
                && $overrideBorderRadius['topRight'] instanceof StringAttr) {
                $styleValues['borderTopRightRadius'] = $overrideBorderRadius['topRight']->asAttr();
            }
            if (isset($overrideBorderRadius['bottomRight'])
                && $overrideBorderRadius['bottomRight'] instanceof StringAttr) {
                $styleValues['borderBottomRightRadius'] = $overrideBorderRadius['bottomRight']->asAttr();
            }
            if (isset($overrideBorderRadius['bottomLeft'])
                && $overrideBorderRadius['bottomLeft'] instanceof StringAttr) {
                $styleValues['borderBottomLeftRadius'] = $overrideBorderRadius['bottomLeft']->asAttr();
            }
        }

        return $styleValues;
    }
}
