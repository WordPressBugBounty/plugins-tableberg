import { getHighlightSegments } from "../search";

interface HighlightedTextProps {
    content: string;
    searchTerm: string;
    highlightColor: string;
}

export function HighlightedText({
    content,
    searchTerm,
    highlightColor,
}: HighlightedTextProps) {
    const segments = getHighlightSegments(content, searchTerm);

    return (
        <>
            {segments.map((segment, index) =>
                segment.highlighted ? (
                    <mark
                        key={index}
                        style={{
                            backgroundColor: highlightColor,
                            borderRadius: "2px",
                        }}
                    >
                        {segment.text}
                    </mark>
                ) : (
                    segment.text
                )
            )}
        </>
    );
}
