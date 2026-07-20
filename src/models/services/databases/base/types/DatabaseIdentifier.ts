/**
 * @summary Type for the database identifier.
 * @description This type is used to store the database identifier. This is a brand type, to prevent type errors.
 */
type DatabaseIdentifier = string & { readonly brand: unique symbol }

export type { DatabaseIdentifier }
