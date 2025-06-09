import { scan, startWith } from "rxjs";
import { createChanges$ } from "./createChanges$.ts";
import { JsonPointer } from "json-ptr";
import { set } from "lodash";

/**
 * Merges all change events into the current state of the form
 */
export const createState$ = <S extends Record<string, unknown>>(
  changes$: ReturnType<typeof createChanges$>,
  initialState: S
) =>
  changes$.pipe(
    scan(
      (state, change) => {
        const next = JSON.parse(JSON.stringify(state)) as S;
        set(next, new JsonPointer(change[0]).path, change[1]);
        return next;
      },
      JSON.parse(JSON.stringify(initialState)) as S
    ),
    startWith(initialState)
  );
