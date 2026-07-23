/**
 * @summary Translation plural texts.
 * @description Holds the four plural forms for a PARAMETER translation.
 */
interface ITranslationParameterTexts {
    /**
     * @summary Text used when the count equals one.
     */
    readonly one: string
    /**
     * @summary Text used for small plural quantities.
     */
    readonly few: string
    /**
     * @summary Text used for large plural quantities.
     */
    readonly many: string
    /**
     * @summary Text used when the count equals zero.
     */
    readonly zero: string
}

export type { ITranslationParameterTexts }
