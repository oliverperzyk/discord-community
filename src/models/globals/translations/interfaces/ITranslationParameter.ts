import type { TranslationArgumentDataType } from "../enums/TranslationArgumentDataType"

/**
 * @summary Translation parameter definition.
 * @description Describes a single named argument for a PARAMETER translation.
 */
interface ITranslationParameter {
    /**
     * @summary The expected data type of the argument.
     */
    readonly type: TranslationArgumentDataType
}

export type { ITranslationParameter }
