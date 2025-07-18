import { useComputed } from "@preact/signals-react";
import { useField as baseUseField, useFormContext } from "../../dist/index.js";
import { useFormErrors } from "./useFormErrors";

export const useField = (name: string) => {
  const { $errors: $baseErrors } = useFormContext() as ReturnType<
    typeof useFormContext
  > & { $errors: ReturnType<typeof useFormErrors>["$errors"] };

  const $errors = useComputed(() => $baseErrors.value.get(name) || []);
  const $hasErrors = useComputed(() => $errors.value.length > 0);
  const baseField = baseUseField(name);
  return {
    ...baseField,
    $errors,
    $hasErrors,
  } as const;
};
