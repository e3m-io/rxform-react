import { distinctUntilChanged, scan, startWith } from "rxjs";
import { createChanges$ } from "./createChanges$.ts";

/**
 * Tracks which fields have had their values modified from the initial form state
 */
export const createDirty$ = (changes$: ReturnType<typeof createChanges$>) =>
  changes$.pipe(
    scan((dirty, [name]) => {
      // Emit the same Set (by reference) if dirty state hasn't changed
      if (dirty.has(name)) {
        return dirty;
      }

      const next = new Set(dirty);

      next.add(name);

      return next;
    }, new Set<string>()),
    distinctUntilChanged(),
    startWith(new Set<string>())
  );
