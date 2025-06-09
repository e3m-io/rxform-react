import { Subject } from "rxjs";

/**
 * Tracks all change/input events in the form
 */
export const createChanges$ = <T extends FormChangeEvent>() => new Subject<T>();

/**
 * A name-value pair to identify the changed field and the new value
 */
export type FormChangeEvent = readonly [name: string, value: unknown];
