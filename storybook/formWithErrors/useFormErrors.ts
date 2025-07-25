import { Observable, of, switchMap } from "rxjs";
import { useForm } from "../../src/react/useForm";
import { useSignal } from "@preact/signals-react/runtime";
import Ajv, { ErrorObject } from "ajv";
import { useEffect } from "react";
import addFormats from "ajv-formats";

export const useFormErrors = (
  form: ReturnType<typeof useForm>,
  formSchema: Record<string, unknown>
) => {
  const errors$ = createErrors$(form.state$, formSchema);

  const $errors = useSignal(
    new Map<string, ErrorObject<string, Record<string, any>, unknown>[]>()
  );

  useEffect(() => {
    const s = errors$.subscribe((errors) => {
      $errors.value = errors;
    });

    return () => s.unsubscribe();
  }, []);

  return {
    errors$,
    $errors,
  } as const;
};

const createErrors$ = (
  state$: Observable<Record<string, unknown>>,
  schema: Record<string, unknown>
) =>
  state$.pipe(
    switchMap((state) => {
      const ajv = new Ajv({ allErrors: true });
      addFormats(ajv);
      const validate = ajv.compile(schema);

      validate(state);

      return of(
        (validate.errors || []).reduce((accum, v) => {
          const key = v.instancePath;
          if (!accum.has(key)) {
            accum.set(key, []);
          }
          accum.set(key, [...accum.get(key)!, v]);
          return accum;
        }, new Map<string, ErrorObject<string, Record<string, any>, unknown>[]>())
      );
    })
  );
