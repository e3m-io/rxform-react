import { useMemo } from "react";
import { createChanges$ } from "../createChanges$.ts";
import { createState$ } from "../createState$.ts";
import { createDirty$ } from "../createDirty$.ts";
import { useSignalFromObservable } from "../utilities.ts";
import { createCommits$ } from "../createCommits$.ts";
import { map, Subject, take } from "rxjs";

/**
 * Creates form state observables and signals
 */
export const useForm = <S extends Record<string, unknown>>(initialState: S) => {
  const changes$ = createChanges$();
  const commits$ = createCommits$();
  const submits$ = new Subject<void>();

  const state$ = createState$(changes$, initialState);

  const dirty$ = createDirty$(changes$);

  const $submitted = useSignalFromObservable(
    submits$.pipe(
      map(() => true),
      take(1)
    ),
    false
  );

  const $dirty = useSignalFromObservable(dirty$, new Set<string>());
  const $state = useSignalFromObservable(state$, initialState);

  return {
    changes$,
    commits$,
    dirty$,
    state$,
    submits$,
    $dirty,
    $state,
    $submitted,
    onChange: (name: string, value: unknown) => {
      changes$.next([name, value]);
    },
    onSubmit: () => {
      submits$.next();
    },
  } as const;
};

export type FormInstance = ReturnType<typeof useForm>;
