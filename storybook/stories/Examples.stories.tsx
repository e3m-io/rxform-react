import { useSignals } from "@preact/signals-react/runtime";
import { TextField } from "../components/TextField";
import { FormProvider, useForm } from "../../dist/index.js";
import { useFormErrors } from "../formWithErrors/useFormErrors";

export default {
  title: "Examples",
};

export const Primary = () => {
  // useSignals();
  const form = useForm({ name: { given: "", family: "" }, email: "" });
  const formErrors = useFormErrors(form, formSchema);
  // const hasErrors = useComputed(() => formErrors.$errors.value.size > 0);
  return (
    <div>
      <FormProvider form={{ ...form, ...formErrors }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.onSubmit();
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
            <TextField name="/email" label="Email" />
            <button type="submit">Submit</button>
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
    email: {
      type: "string",
      format: "email",
      minLength: 1,
    },
  },
  required: ["name", "email"],
};
