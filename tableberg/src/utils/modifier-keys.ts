/**
 * Tracks whether a selection modifier key (Ctrl / Cmd / Shift) is currently
 * held down. While a modifier is held, cell-selection handlers preserve the
 * existing selection so a multi-cell selection can be built up for merging.
 *
 * State is synced from keydown/keyup as well as mousedown — the mousedown sync
 * (capture phase) runs before the selection handlers, guaranteeing an accurate
 * value at the moment those handlers check it, even if a keydown landed
 * in a document we aren't listening to.
 *
 * Listeners are attached per-document so this works in both the iframed and
 * non-iframed editor.
 */

let modifierActive = false;

function sync(event: KeyboardEvent | MouseEvent): void {
    modifierActive = event.ctrlKey || event.metaKey || event.shiftKey;
}

export function isModifierActive(): boolean {
    return modifierActive;
}

export function trackModifierKeys(doc: Document): () => void {
    doc.addEventListener("keydown", sync, true);
    doc.addEventListener("keyup", sync, true);
    doc.addEventListener("mousedown", sync, true);

    return () => {
        doc.removeEventListener("keydown", sync, true);
        doc.removeEventListener("keyup", sync, true);
        doc.removeEventListener("mousedown", sync, true);
    };
}
