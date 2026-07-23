/**
 * @summary Translation argument data type enum.
 * @description Allowed runtime types for PARAMETER translation arguments.
 */
const enum TranslationArgumentDataType {
    /**
     * @summary A string argument.
     */
    STRING = "STRING",
    /**
     * @summary An integer number argument.
     */
    NUMBER = "NUMBER",
    /**
     * @summary A floating-point number argument.
     */
    FLOAT = "FLOAT",
    /**
     * @summary A boolean argument.
     */
    BOOLEAN = "BOOLEAN",
}

export { TranslationArgumentDataType }
