import { isProAvailable } from "../pro-status";

/**
 * Moving rows and columns is a pro feature, so without pro the row and cell
 * blocks are locked against the editor's own movers and drag handle, which
 * is also what the editor's padlock in the toolbar then says. With pro the
 * lock is simply not there, so the core move handles work as they do on any
 * other block.
 *
 * The lock is applied at registration rather than in block.json, since
 * block.json can only carry one fixed default.
 */
export function withMoveLock(attributes: Record<string, unknown>) {
    if (isProAvailable()) {
        return attributes;
    }

    return {
        ...attributes,
        lock: {
            type: "object",
            default: { move: true },
        },
    };
}
