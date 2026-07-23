/**
 * @summary Language code type.
 * @description A type for language codes, to prevent type errors.
 */
type LanguageCode = string & { readonly brand: unique symbol }

export type { LanguageCode }
