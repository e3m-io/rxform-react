import { useComputed, useSignals } from "@preact/signals-react/runtime";
import { TextField } from "../components/TextField";
import { FormProvider } from "../../src/react/formContext";
import { useForm } from "../../src/react/useForm";
import { useFormErrors } from "../formWithErrors/useFormErrors";

export default {
  title: "Examples",
};

export const Primary = () => {
  useSignals();
  const form = useForm({ name: { given: "", family: "" } });
  const formErrors = useFormErrors(form, formSchema);
  const hasErrors = useComputed(() => formErrors.$errors.value.size > 0);
  return (
    <div>
      <FormProvider form={{ ...form, ...formErrors }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (formErrors.$errors.peek().size !== 0) {
              console.log("Form has errors");
              return;
            }
            console.log("Submitting", form.$state.peek());
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <TextField name="/name/given" label="Given name" />
            <TextField name="/name/family" label="Family name" />
            <button type="submit" disabled={hasErrors.value}>
              Submit
            </button>
          </div>
        </form>
      </FormProvider>

      <Output $state={form.$state} $errors={formErrors.$errors} />
    </div>
  );
};

const Output = (props: { $state: any; $errors: any }) => {
  useSignals();
  return (
    <div>
      <h2>State</h2>
      <pre>
        <code>{JSON.stringify(props.$state.value, null, 2)}</code>
      </pre>

      <h2>Errors</h2>
      <pre>
        <code>
          {JSON.stringify(Object.fromEntries(props.$errors.value), null, 2)}
        </code>
      </pre>
    </div>
  );
};

const formSchema = {
  type: "object",
  properties: {
    name: {
      type: "object",
      properties: {
        given: {
          type: "string",
          minLength: 1,
        },
        family: {
          type: "string",
          minLength: 1,
        },
      },
      required: ["given", "family"],
    },
  },
};
