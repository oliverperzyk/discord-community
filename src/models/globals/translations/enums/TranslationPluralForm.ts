/**
 * @summary Translation plural form enum.
 * @description Plural categories used by PARAMETER translation texts.
 */
const enum TranslationPluralForm {
    /**
     * @summary Used when the count equals one.
     */
    ONE = "one",
    /**
     * @summary Used for small plural quantities.
     */
    FEW = "few",
    /**
     * @summary Used for large plural quantities.
     */
    MANY = "many",
    /**
     * @summary Used when the count equals zero.
     */
    ZERO = "zero",
}

export { TranslationPluralForm }
