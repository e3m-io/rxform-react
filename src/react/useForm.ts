import { useMemo } from "react";
import { createChanges$ } from "../createChanges$.ts";
import { createState$ } from "../createState$.ts";
import { createDirty$ } from "../createDirty$.ts";
import { useSignalFromObservable } from "../utilities.ts";

/**
 * Creates form state observables and signals
 */
export const useForm = <S extends Record<string, unknown>>(initialState: S) => {
  const changes$ = useMemo(() => createChanges$(), []);

  const state$ = useMemo(
    () => createState$(changes$, initialState),
    [changes$]
  );

  const dirty$ = useMemo(() => createDirty$(changes$), [changes$]);

  return {
    changes$,
    dirty$,
    state$,
    $dirty: useSignalFromObservable(dirty$, new Set<string>()),
    $state: useSignalFromObservable(state$, initialState),
  } as const;
};

export type FormInstance = ReturnType<typeof useForm>;
