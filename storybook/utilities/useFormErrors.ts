import { Observable, of, switchMap } from "rxjs";
import { useForm } from "../../src/react/useForm";
import { useSignal } from "@preact/signals-react/runtime";
import Ajv, { ErrorObject } from "ajv";
import { useMemo } from "react";
import { useEffect } from "react";
import { memo } from "react";
import { PropsWithChildren } from "react";

export const useFormErrors = (
  form: ReturnType<typeof useForm>,
  formSchema: Record<string, unknown>
) => {
  const errors$ = useMemo(
    () => createErrors$(form.state$, formSchema),
    [form.state$]
  );

  const $errors = useSignal(new Map());

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

export const ErrorProvider = memo(function ErrorProvider(
  props: PropsWithChildren<{ form: ReturnType<typeof useForm> }>
) {
  return props.children;
});
