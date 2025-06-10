# rxform-react

## Usage

```tsx
import { FormProvider, useField, useForm } from "@e3m-io/rxform-react";

function App() {
  const form = useForm(initialState);

  return (
    <FormProvider form={form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.onSubmit();
          console.log("Submitted:", form.$state.peek());
        }}
      >
        <TextField name="/name" />
      </form>
    </FormProvider>
  );
}

const initialState = { name: "" };

function TextField(props: { name: string }) {
  const field = useField(props.name);
  return (
    <input
      name={props.name}
      onInput={(e) => field.onChange(e.currentTarget.value)}
      value={field.$value.value}
    />
  );
}
```
