import { useComputed } from "@preact/signals-react";
import { JsonPointer } from "json-ptr";
import get from "lodash/get.js";
import { useFormContext } from "./formContext.tsx";
import { useSignalFromObservable } from "../utilities.ts";
import { filter, map, take } from "rxjs";

/**
 * Provides state and change handlers for a given field
 */
export const useField = (name: string) => {
  const formContext = useFormContext();
  const path = new JsonPointer(name).path;

  const $dirty = useComputed(() => formContext.$dirty.value.has(name));
  const $value = useComputed(
    () => get(formContext.$state.value, path) as unknown
  );

  const $committed = useSignalFromObservable(
    formContext.commits$.pipe(
      filter((field) => field === name),
      map(() => true),
      take(1)
    ),
    false
  );

  return {
    $committed,
    $dirty,
    $submitted: formContext.$submitted,
    $value,
    onChange: (v: unknown) => {
      formContext.onChange(name, v);
    },
    onCommit: () => {
      formContext.commits$.next(name);
    },
  } as const;
};
