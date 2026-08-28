/**
 * @summary Translation key type enum.
 * @description Distinguishes basic constant texts from parameterized translations.
 */
const enum TranslationKeyType {
    /**
     * @summary A single text, optionally with `{{ argument }}` placeholders.
     */
    BASIC = "BASIC",
    /**
     * @summary A text that accepts arguments and plural forms.
     */
    PARAMETER = "PARAMETER",
}

export { TranslationKeyType }
