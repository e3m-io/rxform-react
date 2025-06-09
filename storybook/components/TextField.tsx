import { useSignals } from "@preact/signals-react/runtime";
import { ReactNode } from "react";
import { memo } from "react";
import { useField } from "../../src/react/useField";

export const TextField = memo(function TextField(props: {
  name: string;
  label: ReactNode;
}) {
  useSignals();
  const { $dirty, $value, onChange } = useField(props.name);

  return (
    <div>
      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {props.label}
        <input
          type="text"
          name={props.name}
          onInput={(e) => {
            onChange(e.currentTarget.value);
          }}
          value={$value.value as string}
        />
      </label>
    </div>
  );
});
