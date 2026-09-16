import { TableCellStylesType } from "../attributes";
import { useTableStore } from "../store";

interface UseCellStyleControlOptions<T> {
    styleKey: keyof TableCellStylesType;
    defaultValue: T;
    hasValue: (value: T) => boolean;
    label: string;
    labelSelected?: string;
}

interface CellStyleControlProps<T> {
    value: T;
    hasValue: () => boolean;
    onChange: (value: T) => void;
    onDeselect: () => void;
    label: string;
}

export function useCellStyleControl<T>({
    styleKey,
    defaultValue,
    hasValue: hasValueFn,
    label,
    labelSelected,
}: UseCellStyleControlOptions<T>): CellStyleControlProps<T> {
    const selectedCells = useTableStore(state => state.selectedCells);
    const cellDefaults = useTableStore(state => state.cellDefaults.styles);
    const getCellStyle = useTableStore(state => state.getCellStyle);
    const updateCellStyles = useTableStore(state => state.updateCellStyles);
    const updateCellGlobalStyles = useTableStore(
        state => state.updateCellGlobalStyles
    );

    const firstSelectedCellStyle =
        selectedCells.length > 0 ? getCellStyle(selectedCells[0]) || {} : {};

    const value =
        selectedCells.length > 0 && firstSelectedCellStyle[styleKey]
            ? ((firstSelectedCellStyle[styleKey] as T) ?? defaultValue)
            : (cellDefaults[styleKey] as T);

    const hasValue = () => {
        if (selectedCells.length > 0) {
            const cellValue = firstSelectedCellStyle[styleKey] as T;
            return cellValue ? hasValueFn(cellValue) : false;
        } else {
            const globalValue = cellDefaults[styleKey] as T;
            return hasValueFn(globalValue);
        }
    };

    const computedLabel =
        selectedCells.length > 0 && labelSelected ? labelSelected : label;

    const onChange = (newValue: T) => {
        if (selectedCells.length > 0) {
            selectedCells.forEach(coord => {
                updateCellStyles(coord, {
                    [styleKey]: newValue,
                } as Partial<TableCellStylesType>);
            });
        } else {
            updateCellGlobalStyles({
                [styleKey]: newValue,
            } as Partial<TableCellStylesType>);
        }
    };

    const onDeselect = () => {
        if (selectedCells.length > 0) {
            selectedCells.forEach(coord => {
                updateCellStyles(coord, {
                    [styleKey]: defaultValue,
                } as Partial<TableCellStylesType>);
            });
        } else {
            updateCellGlobalStyles({
                [styleKey]: defaultValue,
            } as Partial<TableCellStylesType>);
        }
    };

    return {
        value,
        hasValue,
        onChange,
        onDeselect,
        label: computedLabel,
    };
}
