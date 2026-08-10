<?php

namespace Tableberg\Renderer\Table;

use Tableberg\Renderer\Cell\CellRenderer;
use Tableberg\Renderer\Cell\CellRenderContext;
use Tableberg\Renderer\Attrs\StringAttr;

class TableRenderer {
    private function has_visible_border($border) {
        $trimmed_border = trim($border);

        if ($trimmed_border === '') {
            return false;
        }

        $parts = preg_split('/\s+/', $trimmed_border, 3);
        $width = $parts[0] ?? '';
        $style = $parts[1] ?? '';

        if ($width === 'none' || $width === 'hidden') {
            return false;
        }

        if (preg_match('/^0(?:\.0+)?(?:[a-z%]+)?$/i', $width) === 1) {
            return false;
        }

        if ($style === 'none' || $style === 'hidden') {
            return false;
        }

        return true;
    }

    public function render($attributes, $content = '', $block = null) {
        // v4 native-blocks format: table data lives in the innerBlocks tree
        // (rows -> cells -> elements). Adapt it to the v3 attrs shape so the
        // renderer below stays format-agnostic.
        $version = is_array($attributes) && isset($attributes['version']) && is_numeric($attributes['version'])
            ? (int) $attributes['version']
            : 0;
        if (
            $version >= 4 &&
            is_object($block) &&
            isset($block->parsed_block['innerBlocks']) &&
            is_array($block->parsed_block['innerBlocks'])
        ) {
            $attributes = InnerBlocksAttrsAdapter::to_attrs(
                $attributes,
                $block->parsed_block['innerBlocks']
            );
        }

        $attrs = TableAttrs::from_array($attributes);

        $rows = $attrs->table->rows->value();
        $cols = $attrs->table->cols->value();

        $headerEnabled = $attrs->table->headerEnabled->value();
        $footerEnabled = $attrs->table->footerEnabled->value();

        // Sticky header/first column are pro features: free never enables
        // them on its own, and pro reads the raw table attrs to decide.
        $stickySettings = apply_filters(
            'tableberg/table_sticky_settings',
            ['stickyHeader' => false, 'stickyFirstCol' => false],
            $attrs->attrs
        );
        $stickyHeader = !empty($stickySettings['stickyHeader']);
        $stickyFirstCol = !empty($stickySettings['stickyFirstCol']);

        $caption = $attrs->table->caption;
        $tableWidth = trim($attrs->table->tableWidth->asAttr());
        $tableAlignment = $attrs->table->tableAlignment->asAttr();
        $cellSpacingHorizontal = trim($attrs->table->cellSpacing->horizontal->asAttr());
        $cellSpacingVertical = trim($attrs->table->cellSpacing->vertical->asAttr());
        $tableBorderTop = trim($attrs->table->tableBorder->top->asAttr());
        $tableBorderRight = trim($attrs->table->tableBorder->right->asAttr());
        $tableBorderBottom = trim($attrs->table->tableBorder->bottom->asAttr());
        $tableBorderLeft = trim($attrs->table->tableBorder->left->asAttr());
        $fixedColumnWidths = $attrs->table->fixedColumnWidths->value();

        $isHorizontalSpacingZero = $cellSpacingHorizontal === '0';
        $isVerticalSpacingZero = $cellSpacingVertical === '0';
        $hasCellSpacing = !$isHorizontalSpacingZero || !$isVerticalSpacingZero;

        $isWideWidth = $tableWidth === 'wide';
        $isFullWidth = $tableWidth === 'full';

        $canApplyCustomWidth =
            $tableWidth !== '' &&
            !$isWideWidth &&
            !$isFullWidth &&
            $tableWidth !== 'auto';

        if (!$canApplyCustomWidth) {
            $tableWidth = '';
        }

        $wrapperAlignmentClass = $this->getWrapperAlignmentClass(
            $isWideWidth,
            $isFullWidth,
            $canApplyCustomWidth,
            $tableAlignment
        );

        $tableStyles = [
            'border-collapse: ' . ($hasCellSpacing ? 'separate' : 'collapse'),
        ];

        if ($hasCellSpacing) {
            $tableStyles[] = "border-spacing: {$cellSpacingHorizontal} {$cellSpacingVertical}";
        }

        if ($tableWidth !== '') {
            $tableStyles[] = "width: {$tableWidth}";
            $tableStyles[] = "max-width: {$tableWidth}";
        } else {
            $tableStyles[] = 'width: 100%';
        }

        if ($tableBorderTop !== '') {
            $tableStyles[] = "border-top: {$tableBorderTop}";
        }

        if ($tableBorderRight !== '') {
            $tableStyles[] = "border-right: {$tableBorderRight}";
        }

        if ($tableBorderBottom !== '') {
            $tableStyles[] = "border-bottom: {$tableBorderBottom}";
        }

        if ($tableBorderLeft !== '') {
            $tableStyles[] = "border-left: {$tableBorderLeft}";
        }

        $tableStyleAttr = "style='" . implode('; ', $tableStyles) . ";'";

        $tableClasses = ['wp-block-tableberg'];

        if ($this->has_visible_border($tableBorderTop)) {
            $tableClasses[] = 'tableberg-has-table-border-top';
        }

        if ($this->has_visible_border($tableBorderRight)) {
            $tableClasses[] = 'tableberg-has-table-border-right';
        }

        if ($this->has_visible_border($tableBorderBottom)) {
            $tableClasses[] = 'tableberg-has-table-border-bottom';
        }

        if ($this->has_visible_border($tableBorderLeft)) {
            $tableClasses[] = 'tableberg-has-table-border-left';
        }

        if ($hasCellSpacing) {
            $tableClasses[] = 'tableberg-has-cell-spacing';

            if ($isHorizontalSpacingZero) {
                $tableClasses[] = 'tableberg-cell-spacing-horizontal-zero';
            }

            if ($isVerticalSpacingZero) {
                $tableClasses[] = 'tableberg-cell-spacing-vertical-zero';
            }
        }

        $tableClassAttr = implode(' ', $tableClasses);

        // Column sorting is a pro feature: free never marks a column
        // sortable on its own, and pro reads the table's raw columns to
        // decide which ones are.
        $sortableColumns = apply_filters(
            'tableberg/sortable_columns',
            [],
            $attrs->attrs
        );
        if (!is_array($sortableColumns)) {
            $sortableColumns = [];
        }

        $paginationPageSize = (int) $attrs->table->pagination->pageSize->value();
        if ($paginationPageSize < 1) {
            $paginationPageSize = 1;
        }

        $paginationConfig = [
            'enabled' => apply_filters('tableberg/pagination_enabled', false, $attrs->attrs),
            'pageSize' => $paginationPageSize,
            'showPageNumbers' => $attrs->table->pagination->showPageNumbers->value(),
            'showPrevNext' => $attrs->table->pagination->showPrevNext->value(),
        ];

        $searchSettings = apply_filters(
            'tableberg/table_search_settings',
            [
                'enabled' => false,
                'placeholder' => '',
                'position' => 'left',
                'highlightColor' => '',
            ],
            $attrs->attrs
        );
        $searchEnabledAsStr = !empty($searchSettings['enabled']) ? 'true' : 'false';
        $searchPlaceholder = (string) ($searchSettings['placeholder'] ?? '');
        $searchPosition = (string) ($searchSettings['position'] ?? 'left');
        $searchHighlightColor = (string) ($searchSettings['highlightColor'] ?? '');
        $responsiveDataAttrs = $this->buildResponsiveDataAttrs($attrs, $rows, $cols);

        // Horizontal cell-element layout (and the wrap toggle that only
        // matters with it) is a pro feature; free's default is always the
        // vertical stack. Grouped in one filter since they're one decision.
        $cellLayout = apply_filters(
            'tableberg/cell_default_layout',
            ['orientation' => 'vertical', 'wrap' => 'nowrap'],
            $attrs->attrs
        );

        $globalCellStyles = [
            'padding' => [
                'top' => $attrs->cellDefaults->styles->padding->top->asAttr(),
                'right' => $attrs->cellDefaults->styles->padding->right->asAttr(),
                'bottom' => $attrs->cellDefaults->styles->padding->bottom->asAttr(),
                'left' => $attrs->cellDefaults->styles->padding->left->asAttr(),
            ],
            'orientation' => $cellLayout['orientation'] === 'horizontal' ? 'horizontal' : 'vertical',
            'elementGap' => $attrs->cellDefaults->styles->elementGap->asAttr(),
            'wrap' => $cellLayout['wrap'] === 'wrap' ? 'wrap' : 'nowrap',
            'verticalAlign' => $attrs->cellDefaults->styles->verticalAlign->asAttr(),
            'backgroundColor' => $attrs->cellDefaults->styles->backgroundColor->asAttr(),
            'border' => [
                'top' => $attrs->cellDefaults->styles->border->top->asAttr(),
                'right' => $attrs->cellDefaults->styles->border->right->asAttr(),
                'bottom' => $attrs->cellDefaults->styles->border->bottom->asAttr(),
                'left' => $attrs->cellDefaults->styles->border->left->asAttr(),
            ],
            'borderRadius' => [
                'topLeft' => $attrs->cellDefaults->styles->borderRadius->topLeft->asAttr(),
                'topRight' => $attrs->cellDefaults->styles->borderRadius->topRight->asAttr(),
                'bottomRight' => $attrs->cellDefaults->styles->borderRadius->bottomRight->asAttr(),
                'bottomLeft' => $attrs->cellDefaults->styles->borderRadius->bottomLeft->asAttr(),
            ],
        ];

        // The table border radius rounds the whole table's outer corners.
        // border-radius on collapsed-border tables/cells is ignored by
        // browsers, so it is rendered on the wrapper (with overflow:hidden)
        // and removed from the individual cells here.
        $tableRadius = $globalCellStyles['borderRadius'];
        $globalCellStyles['borderRadius'] = [
            'topLeft' => '',
            'topRight' => '',
            'bottomRight' => '',
            'bottomLeft' => '',
        ];

        $cellRenderer = new CellRenderer();
        $hiddenBySpan = [];

        $rowsHtml = '';

        for ($row = 0; $row < $rows; $row++) {
            $cellsHtml = '';
            $rowHeight = $this->getRowHeight($row, $attrs->rows);
            $rowStyles = $this->getRowStyles($row, $attrs->rows);
            $rowBackgroundColor = isset($rowStyles['backgroundColor']) && is_string($rowStyles['backgroundColor'])
                ? $rowStyles['backgroundColor']
                : '';

            // A row with its own background would otherwise never show
            // through: every cell paints its own background over the
            // `<tr>`'s, and cells fall back to the table-wide default
            // whenever they carry no colour of their own. So for this row's
            // cells, that fallback is cleared — a cell/column colour on top
            // of it (applied below by the pro filter) still wins either way.
            $cellStylesForRow = $globalCellStyles;
            if ($rowBackgroundColor !== '') {
                $cellStylesForRow['backgroundColor'] = '';
            }

            for ($col = 0; $col < $cols; $col++) {
                if (isset($hiddenBySpan[$row][$col])) {
                    continue;
                }

                $cell = $this->getCell($row, $col, $attrs->cells);
                $span = $this->getCellSpan($cell);

                $rowSpan = is_numeric($span['rowSpan']) ? (int) $span['rowSpan'] : 1;
                $colSpan = is_numeric($span['colSpan']) ? (int) $span['colSpan'] : 1;

                if ($rowSpan > 1 || $colSpan > 1) {
                    for ($rowOffset = 0; $rowOffset < $rowSpan; $rowOffset++) {
                        for ($colOffset = 0; $colOffset < $colSpan; $colOffset++) {
                            if ($rowOffset === 0 && $colOffset === 0) {
                                continue;
                            }

                            $hiddenRow = $row + $rowOffset;
                            $hiddenCol = $col + $colOffset;
                            $hiddenBySpan[$hiddenRow][$hiddenCol] = true;
                        }
                    }
                }

                $isHeaderRowCell = $headerEnabled && $row === 0;
                $isFooterCell = $footerEnabled && $rows > 0 && $row === $rows - 1;

                $tag = ($isHeaderRowCell || $isFooterCell) ? 'th' : 'td';

                $sortableType = (
                    $isHeaderRowCell &&
                    array_key_exists($col, $sortableColumns)
                ) ? $sortableColumns[$col] : null;

                $columnWidth = null;
                if ($colSpan === 1) {
                    if ($fixedColumnWidths && $cols > 0) {
                        $columnWidth = (string) (100 / $cols) . '%';
                    } else {
                        $columnWidth = $this->getColumnWidth(
                            $col,
                            $attrs->columns
                        );
                    }
                }

                $cellsHtml .= $cellRenderer->render(
                    CellRenderContext::create(
                        $row,
                        $col,
                        $rowSpan,
                        $colSpan,
                        $tag,
                        $cellStylesForRow,
                        $this->getCellElements($cell),
                        $this->getCellStyleOverride($cell),
                        $this->getCellRibbon($cell),
                        $sortableType,
                        $columnWidth,
                        $rowHeight,
                        $stickyHeader,
                        $stickyFirstCol,
                        $this->getCellClassName($cell),
                        $cell instanceof CellData ? $cell->attrs : [],
                        $this->isCellEmpty($cell)
                    )
                );
            }

            $rowStyleParts = [];
            if ($rowBackgroundColor !== '') {
                $rowStyleParts[] = 'background-color:' . esc_attr($rowBackgroundColor);
            }

            $rowBorder = isset($rowStyles['border']) && is_array($rowStyles['border'])
                ? $rowStyles['border']
                : [];
            foreach (['top', 'right', 'bottom', 'left'] as $side) {
                $value = isset($rowBorder[$side]) && is_string($rowBorder[$side])
                    ? $rowBorder[$side]
                    : '';
                if ($value !== '') {
                    $rowStyleParts[] = "border-{$side}:" . esc_attr($value);
                }
            }

            $rowStyleAttr = !empty($rowStyleParts)
                ? ' style="' . implode(';', $rowStyleParts) . '"'
                : '';

            $rowsHtml .= "<tr data-tableberg-row='{$row}'$rowStyleAttr>$cellsHtml</tr>";
        }

        $sortingBoolAsStr = !empty($sortableColumns) ? 'true' : 'false';
        $headerBoolAsStr = $headerEnabled ? 'true' : 'false';
        $footerBoolAsStr = $footerEnabled ? 'true' : 'false';

        $columnsData = [];
        foreach ($sortableColumns as $column => $sortType) {
            $columnsData[$column] = [
                'sortable' => $sortType,
            ];
        }

        $columnsJson = json_encode($columnsData);
        if (!is_string($columnsJson)) {
            $columnsJson = '{}';
        }

        $paginationJson = json_encode($paginationConfig);
        if (!is_string($paginationJson)) {
            $paginationJson = '{}';
        }

        $wrapperClass = trim("tableberg-table-wrapper {$wrapperAlignmentClass}");

        // Round the whole table's outer corners by clipping the wrapper.
        // Zero radii are skipped so a table without any actual rounding does
        // not carry pointless border-radius declarations.
        $isZeroRadius = function ($value) {
            $trimmed = trim((string) $value);
            return $trimmed === '' || preg_match('/^0(?:\.0+)?[a-z%]*$/i', $trimmed) === 1;
        };
        $wrapperStyles = [];
        if (!$isZeroRadius($tableRadius['topLeft'])) {
            $wrapperStyles[] = 'border-top-left-radius:' . $tableRadius['topLeft'];
        }
        if (!$isZeroRadius($tableRadius['topRight'])) {
            $wrapperStyles[] = 'border-top-right-radius:' . $tableRadius['topRight'];
        }
        if (!$isZeroRadius($tableRadius['bottomRight'])) {
            $wrapperStyles[] = 'border-bottom-right-radius:' . $tableRadius['bottomRight'];
        }
        if (!$isZeroRadius($tableRadius['bottomLeft'])) {
            $wrapperStyles[] = 'border-bottom-left-radius:' . $tableRadius['bottomLeft'];
        }

        // A table wider than its wrapper must scroll inside the wrapper
        // instead of pushing the whole page sideways, so the wrapper is a
        // scroll container by default.
        //
        // The one exception is a header that sticks to the page: a scroll
        // container of its own would capture it and it would never stick.
        // (CSS cannot do both — with overflow-x set, overflow-y can no longer
        // be visible.) A sticky first column, on the other hand, only works
        // *because* of the scroll container, so when both are enabled the
        // scrolling wins and the header sticks within the wrapper.
        //
        // A rounded wrapper always needs the clip, so it opts in regardless.
        $pageStickyHeader = $stickyHeader && !$stickyFirstCol;
        $hasRoundedCorners = !empty($wrapperStyles);

        if ($hasRoundedCorners || !$pageStickyHeader) {
            // `auto`, not `hidden`: both clip to the rounded corners, but
            // `hidden` would also swallow a table wider than the wrapper.
            // Inline, so it also wins over the `.tableberg-scroll-x` rule.
            $wrapperStyles[] = 'overflow:auto';
        }

        $wrapperStyleAttr = !empty($wrapperStyles)
            ? "style='" . implode(';', $wrapperStyles) . "'"
            : '';

        $figureAlignmentClass = '';
        if ($isWideWidth) {
            $figureAlignmentClass = 'alignwide';
        } elseif ($isFullWidth) {
            $figureAlignmentClass = 'alignfull';
        }

        $figureClass = trim(
            implode(' ', array_filter([
                'wp-block-tableberg',
                $attrs->table->className->asAttr(),
                $figureAlignmentClass,
            ]))
        );

        $figureStyles = [];
        $spacingSides = [
            'margin-top' => $attrs->table->margin->top,
            'margin-right' => $attrs->table->margin->right,
            'margin-bottom' => $attrs->table->margin->bottom,
            'margin-left' => $attrs->table->margin->left,
            'padding-top' => $attrs->table->padding->top,
            'padding-right' => $attrs->table->padding->right,
            'padding-bottom' => $attrs->table->padding->bottom,
            'padding-left' => $attrs->table->padding->left,
        ];
        foreach ($spacingSides as $prop => $sideAttr) {
            if ($sideAttr->isNotEmpty()) {
                $figureStyles[] = $prop . ': ' . $sideAttr->asAttr();
            }
        }
        $figureStyleAttr = !empty($figureStyles)
            ? "style='" . implode('; ', $figureStyles) . ";'"
            : '';

        $captionHtml = '';
        if ($caption->isNotEmpty()) {
            $captionHtml = "<figcaption class='tableberg-table-caption wp-element-caption'>{$caption->asHtml()}</figcaption>";
        }

        $html =
            "<figure class='{$figureClass}' {$figureStyleAttr}>
                <div class='{$wrapperClass}' {$wrapperStyleAttr}>
                    <table
                        class='{$tableClassAttr}'
                        {$tableStyleAttr}
                        data-tableberg-sortable='$sortingBoolAsStr'
                        data-tableberg-columns='$columnsJson'
                        data-tableberg-pagination='$paginationJson'
                        data-tableberg-search-enabled='$searchEnabledAsStr'
                        data-tableberg-search-placeholder='$searchPlaceholder'
                        data-tableberg-search-position='$searchPosition'
                        data-tableberg-search-highlight-color='$searchHighlightColor'
                        data-tableberg-header='$headerBoolAsStr'
                        data-tableberg-footer='$footerBoolAsStr'
                        {$responsiveDataAttrs}
                    >
                        <tbody>
                            {$rowsHtml}
                        </tbody>
                    </table>
                </div>
                {$captionHtml}
            </figure>";

        return $html;
    }

    /**
     * @param bool $isWideWidth
     * @param bool $isFullWidth
     * @param bool $canApplyCustomWidth
     * @param string $alignment
     * @return string
     */
    private function getWrapperAlignmentClass(
        $isWideWidth,
        $isFullWidth,
        $canApplyCustomWidth,
        $alignment
    ) {
        if ($isWideWidth) {
            return 'alignwide';
        }

        if ($isFullWidth) {
            return 'alignfull';
        }

        if (!$canApplyCustomWidth) {
            return '';
        }

        if ($alignment === 'left' || $alignment === 'right') {
            return 'justify-table-' . $alignment;
        }

        if ($alignment === 'center') {
            return 'justify-table-center';
        }

        return '';
    }

    /**
     * @param TableAttrs $attrs
     * @param int $rows
     * @param int $cols
     * @return string
     */
    private function buildResponsiveDataAttrs($attrs, $rows, $cols) {
        $tablet = $attrs->table->responsive->tablet;
        $mobile = $attrs->table->responsive->mobile;

        $tabletEnabled = $tablet->enabled->value();
        $mobileEnabled = $mobile->enabled->value();

        if (!$tabletEnabled && !$mobileEnabled) {
            return '';
        }

        $tabletMaxWidth = max(1, (int) $tablet->maxWidth->value());
        $mobileMaxWidth = max(1, (int) $mobile->maxWidth->value());
        $tabletStackCount = max(1, (int) $tablet->stackCount->value());
        $mobileStackCount = max(1, (int) $mobile->stackCount->value());

        return "
            data-tableberg-responsive='true'
            data-tableberg-rows='{$rows}'
            data-tableberg-cols='{$cols}'
            data-tableberg-tablet-enabled='{$tablet->enabled->asAttr()}'
            data-tableberg-tablet-width='{$tabletMaxWidth}'
            data-tableberg-tablet-mode='{$tablet->mode->asAttr()}'
            data-tableberg-tablet-transpose='{$tablet->transpose->asAttr()}'
            data-tableberg-tablet-count='{$tabletStackCount}'
            data-tableberg-tablet-repeat-first-col='{$tablet->repeatFirstCol->asAttr()}'
            data-tableberg-mobile-enabled='{$mobile->enabled->asAttr()}'
            data-tableberg-mobile-width='{$mobileMaxWidth}'
            data-tableberg-mobile-mode='{$mobile->mode->asAttr()}'
            data-tableberg-mobile-transpose='{$mobile->transpose->asAttr()}'
            data-tableberg-mobile-count='{$mobileStackCount}'
            data-tableberg-mobile-repeat-first-col='{$mobile->repeatFirstCol->asAttr()}'
        ";
    }

    private function getCell($row, $col, $cells) {
        $key = $row . ',' . $col;

        if (!is_array($cells) || !array_key_exists($key, $cells)) {
            return null;
        }

        return $cells[$key];
    }

    private function getCellElements($cell) {
        if ($this->isCellEmpty($cell)) {
            return [];
        }

        return $cell instanceof CellData && is_array($cell->elements)
            ? $cell->elements
            : [];
    }

    /**
     * "Empty cell" is a pro feature: the cell renders as if it were a bare,
     * unstyled table cell — no content, no background, no border. Free's
     * default is to always show the cell as configured.
     *
     * @param mixed $cell
     * @return bool
     */
    private function isCellEmpty($cell) {
        if (!$cell instanceof CellData) {
            return false;
        }

        return (bool) apply_filters('tableberg/cell_is_empty', false, $cell->attrs);
    }

    private function getCellStyleOverride($cell) {
        if (!$cell instanceof CellData || !is_array($cell->styles)) {
            return null;
        }

        return StringAttr::fromNestedArray($cell->styles);
    }

    private function getCellRibbon($cell) {
        if (!$cell instanceof CellData || !is_array($cell->ribbon)) {
            return null;
        }

        return $cell->ribbon;
    }

    /**
     * @param CellData|null $cell
     * @return string|null
     */
    private function getCellClassName($cell) {
        if (!$cell instanceof CellData || !$cell->className instanceof StringAttr) {
            return null;
        }

        $className = $cell->className->asAttr();

        return $className === '' ? null : $className;
    }

    private function getCellSpan($cell) {
        $span = ['rowSpan' => 1, 'colSpan' => 1];

        if ($cell instanceof CellData && $cell->span instanceof Span) {
            $span['rowSpan'] = $cell->span->rowSpan->value();
            $span['colSpan'] = $cell->span->colSpan->value();
        }

        return $span;
    }

    /**
     * @param int $column
     * @param array<int|string, ColumnConfig> $columns
     * @return string|null
     */
    private function getColumnWidth($column, $columns) {
        if (!is_array($columns) || !array_key_exists($column, $columns)) {
            return null;
        }

        $columnConfig = $columns[$column];
        if (!$columnConfig instanceof ColumnConfig || $columnConfig->width === null) {
            return null;
        }

        $width = $columnConfig->width->asAttr();
        return $width === '' ? null : $width;
    }

    /**
     * @param int $row
     * @param array<int|string, RowConfig> $rowConfigs
     * @return string|null
     */
    private function getRowHeight($row, $rowConfigs) {
        if (!is_array($rowConfigs) || !array_key_exists($row, $rowConfigs)) {
            return null;
        }

        $rowConfig = $rowConfigs[$row];
        if (!$rowConfig instanceof RowConfig || $rowConfig->height === null) {
            return null;
        }

        $height = $rowConfig->height->asAttr();
        return $height === '' ? null : $height;
    }

    /**
     * Pro styling of a row (e.g. background colour). One filter carries
     * every pro row style, mirroring `tableberg/cell_styles`, so a new pro
     * style needs no change here.
     *
     * @param int $row
     * @param array<int|string, RowConfig> $rowConfigs
     * @return array<string, string>
     */
    private function getRowStyles($row, $rowConfigs) {
        $rowAttrs = (
            is_array($rowConfigs) &&
            array_key_exists($row, $rowConfigs) &&
            $rowConfigs[$row] instanceof RowConfig
        ) ? $rowConfigs[$row]->attrs : [];

        $styles = apply_filters('tableberg/row_styles', [], $rowAttrs);

        return is_array($styles) ? $styles : [];
    }
}
