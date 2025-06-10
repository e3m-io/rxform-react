import { Subject } from "rxjs";

/**
 * Tracks any time input is "completed" on a field, such as
 * blurring a text input field, or selecting an option from a dropdown
 */
export const createCommits$ = () => new Subject<string>();
