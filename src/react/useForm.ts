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
  const changes$ = useMemo(() => createChanges$(), []);
  const commits$ = useMemo(() => createCommits$(), []);
  const submits$ = useMemo(() => new Subject<void>(), []);

  const state$ = useMemo(
    () => createState$(changes$, initialState),
    [changes$]
  );

  const dirty$ = useMemo(() => createDirty$(changes$), [changes$]);

  const $submitted = useSignalFromObservable(
    useMemo(
      () =>
        submits$.pipe(
          map(() => true),
          take(1)
        ),
      []
    ),
    false
  );

  return {
    changes$,
    commits$,
    dirty$,
    state$,
    submits$,
    $dirty: useSignalFromObservable(dirty$, new Set<string>()),
    $state: useSignalFromObservable(state$, initialState),
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
