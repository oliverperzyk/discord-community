/**
 * @summary Options for the verification requests page button component.
 * @description This interface is used to define the options for the verification requests page button component.
 */
interface IVerificationRequestsPageButtonComponentOptions {
    /**
     * @summary The page number.
     * @description The page number.
     */
    readonly page: number
    /**
     * @summary The action to perform.
     * @description The action to perform.
     */
    readonly action: "previous" | "next"
}

export type { IVerificationRequestsPageButtonComponentOptions }
