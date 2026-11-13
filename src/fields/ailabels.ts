import type { PaginatedOctokit } from "../utils.js";

/**
 * Reads one family of the Accord Project agent network's PR labels, such as
 * `ai/kind:bugfix`, as a single-select value (`bugfix`).
 *
 * Only values in `options` count, so a label outside the agreed list leaves the
 * field empty. If a PR somehow carries more than one, the first in `options`
 * order wins, which keeps the value stable between runs.
 */
export function labelValue<T extends string>(prefix: string, options: readonly T[]) {
    return async (_octokit: PaginatedOctokit, pr: any): Promise<T> => {
        const names = new Set<string>(
            (pr.labels?.nodes ?? [])
                .map((label: any) => label?.name)
                .filter((name: unknown): name is string => typeof name === "string" && name.startsWith(prefix))
                .map((name: string) => name.slice(prefix.length))
        );
        // null clears the field, as in the other fields' getValue functions.
        return (options.find(option => names.has(option)) ?? null) as T;
    };
}
