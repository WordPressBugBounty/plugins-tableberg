import { InserterItem } from "./items";
import InserterListItem from "./inserter-list-item";

interface InserterListProps {
    items: InserterItem[];
    onSelect: (item: InserterItem) => void;
}

export default function InserterList({ items, onSelect }: InserterListProps) {
    return (
        <div className="tableberg-cell-inserter__list">
            {items.map(item => (
                <InserterListItem
                    key={item.name}
                    item={item}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}
