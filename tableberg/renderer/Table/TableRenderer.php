<?php

namespace Tableberg\Renderer\Table;

use Tableberg\Renderer\Cell\CellRenderer;
use Tableberg\Renderer\Cell\CellRenderContext;
use Tableberg\Renderer\Attrs\StringAttr;

class TableRenderer {
    /**
     * @return bool
     */
    private function is_pro_active() {
        if (!function_exists('tp_fs')) {
            return false;
        }

        $fs = call_user_func('tp_fs');

        return is_object($fs) && $fs->can_use_premium_code();
    }

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

    public function render($attributes) {
        $attrs = TableAttrs::from_array($attributes);
        $isProActive = $this->is_pro_active();

        $rows = $attrs->table->rows->value();
        $cols = $attrs->table->cols->value();

        $headerEnabled = $attrs->table->headerEnabled->value();
        $footerEnabled = $attrs->table->footerEnabled->value();
        $stickyHeader = $attrs->table->stickyHeader->value();
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

        $sortableColumns = [];

        if ($isProActive) {
            foreach ($attrs->columns as $column => $columnConfig) {
                if ($columnConfig->sortable === null) {
                    continue;
                }

                $sortableColumns[$column] = $columnConfig->sortable->asAttr();
            }
        }

        $paginationPageSize = (int) $attrs->table->pagination->pageSize->value();
        if ($paginationPageSize < 1) {
            $paginationPageSize = 1;
        }

        $paginationConfig = [
            'enabled' => $isProActive && $attrs->table->pagination->enabled->value(),
            'pageSize' => $paginationPageSize,
            'showPageNumbers' => $attrs->table->pagination->showPageNumbers->value(),
            'showPrevNext' => $attrs->table->pagination->showPrevNext->value(),
        ];

        $searchEnabledAsStr = (
            $isProActive && $attrs->table->search->enabled->value()
        ) ? 'true' : 'false';
        $searchPlaceholder = $isProActive
            ? $attrs->table->search->placeholder->asAttr()
            : '';
        $searchPosition = $isProActive
            ? $attrs->table->search->position->asAttr()
            : 'left';
        $searchHighlightColor = $isProActive
            ? $attrs->table->search->highlightColor->asAttr()
            : '';
        $responsiveDataAttrs = $this->buildResponsiveDataAttrs($attrs, $rows, $cols);

        $globalCellStyles = [
            'padding' => [
                'top' => $attrs->cellDefaults->styles->padding->top->asAttr(),
                'right' => $attrs->cellDefaults->styles->padding->right->asAttr(),
                'bottom' => $attrs->cellDefaults->styles->padding->bottom->asAttr(),
                'left' => $attrs->cellDefaults->styles->padding->left->asAttr(),
            ],
            'orientation' => $attrs->cellDefaults->styles->orientation->asAttr(),
            'elementGap' => $attrs->cellDefaults->styles->elementGap->asAttr(),
            'wrap' => $attrs->cellDefaults->styles->wrap->asAttr(),
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

        $cellRenderer = new CellRenderer();
        $hiddenBySpan = [];

        $rowsHtml = '';

        for ($row = 0; $row < $rows; $row++) {
            $cellsHtml = '';
            $rowHeight = $this->getRowHeight($row, $attrs->rows);

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
                        $globalCellStyles,
                        $this->getCellElements($cell),
                        $this->getCellStyleOverride($cell),
                        $this->getCellRibbon($cell),
                        $sortableType,
                        $columnWidth,
                        $rowHeight,
                        $stickyHeader,
                        $this->getCellClassName($cell)
                    )
                );
            }

            $rowsHtml .= "<tr data-tableberg-row='{$row}'>$cellsHtml</tr>";
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

        $captionHtml = '';
        if ($caption->isNotEmpty()) {
            $captionHtml = "<figcaption class='tableberg-table-caption wp-element-caption'>{$caption->asHtml()}</figcaption>";
        }

        $html =
            "<figure class='{$figureClass}'>
                <div class='{$wrapperClass}'>
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
        if (!$cell instanceof CellData) {
            return [];
        }

        return is_array($cell->elements) ? $cell->elements : [];
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
}
