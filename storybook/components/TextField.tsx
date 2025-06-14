import { useSignals } from "@preact/signals-react/runtime";
import { ReactNode } from "react";
import { memo } from "react";
import { useField } from "../formWithErrors/useField";

export const TextField = memo(function TextField(props: {
  name: string;
  label: ReactNode;
}) {
  useSignals();

  const {
    $dirty,
    $value,
    onChange,
    onCommit,
    $errors,
    $hasErrors,
    $committed,
    $submitted,
  } = useField(props.name);

  return (
    <div>
      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {props.label}
        <input
          aria-invalid={$hasErrors.value}
          type="text"
          name={props.name}
          onInput={(e) => {
            onChange(e.currentTarget.value);
          }}
          onBlur={() => {
            onCommit();
          }}
          value={$value.value as string}
        />
      </label>
      {($submitted.value || $committed.value) && $errors.value.length > 0 && (
        <div>{$errors.value.at(0)!.message}</div>
      )}
    </div>
  );
});
