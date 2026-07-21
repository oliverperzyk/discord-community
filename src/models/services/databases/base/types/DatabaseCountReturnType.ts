/**
 * @summary Type for the return type of the count entries in a table.
 * @description This type is used to return the count of entries in a table.
 * @example
 * ```ts
 * import { DatabaseCountReturnType } from "./types/DatabaseCountReturnType"
 *
 * const count: DatabaseCountReturnType = [{ readonly count: 10 }]
 * ```
 */
type DatabaseCountReturnType = [{ readonly count: number }]

export { DatabaseCountReturnType }
