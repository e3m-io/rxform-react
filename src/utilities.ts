import { useSignal, type ReadonlySignal } from "@preact/signals-react";
import { useEffect } from "react";
import type { Observable } from "rxjs";

export const useSignalFromObservable = <T>(
  o$: Observable<T>,
  initialState: T
) => {
  const $o = useSignal(initialState);

  useEffect(() => {
    const s = o$.subscribe((v) => {
      $o.value = v;
    });

    return () => {
      s.unsubscribe();
    };
  }, [o$]);

  return $o as ReadonlySignal<T>;
};
