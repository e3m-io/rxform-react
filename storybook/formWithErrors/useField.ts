import { useComputed } from "@preact/signals-react";
import { useFormContext } from "../../src/react/formContext";
import { useField as baseUseField } from "../../src/react/useField";
import { useFormErrors } from "./useFormErrors";

export const useField = (name: string) => {
  const { $errors: $baseErrors } = useFormContext() as ReturnType<
    typeof useFormContext
  > & { $errors: ReturnType<typeof useFormErrors>["$errors"] };

  const $errors = useComputed(() => $baseErrors.value.get(name) || []);

  return {
    ...baseUseField(name),
    $errors,
    $hasErrors: useComputed(() => $errors.value.length > 0),
  } as const;
};
