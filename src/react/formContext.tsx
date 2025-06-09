import { createContext, useContext, type PropsWithChildren } from "react";
import { type FormInstance } from "./useForm.ts";

const formContext = createContext<FormInstance | null>(null);

export const FormProvider = (
  props: PropsWithChildren<{ form: FormInstance }>
) => {
  return (
    <formContext.Provider value={props.form}>
      {props.children}
    </formContext.Provider>
  );
};

export const useFormContext = () => {
  const ctx = useContext(formContext);

  if (!ctx) {
    throw new Error("formContext provider is required");
  }

  return ctx;
};
