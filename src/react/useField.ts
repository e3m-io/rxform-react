import { useComputed } from "@preact/signals-react";
import { JsonPointer } from "json-ptr";
import { get } from "lodash";
import { useMemo } from "react";
import { useFormContext } from "./formContext.tsx";

/**
 * Provides state and change handlers for a given field
 */
export const useField = (name: string) => {
  const formContext = useFormContext();
  const path = useMemo(() => new JsonPointer(name).path, [name]);

  const $dirty = useComputed(() => formContext.$dirty.value.has(name));
  const $value = useComputed(
    () => get(formContext.$state.value, path) as unknown
  );

  return {
    $dirty,
    $value,
    onChange: (v: unknown) => {
      formContext.changes$.next([name, v]);
    },
  } as const;
};
