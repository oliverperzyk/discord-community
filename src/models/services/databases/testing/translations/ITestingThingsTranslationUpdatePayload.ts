/**
 * @summary The testing things translation update payload interface.
 * @description This interface is used to update a testing things translation.
 */
interface ITestingThingsTranslationUpdatePayload {
    /**
     * @summary The title.
     * @description The title of the translation.
     */
    readonly title?: string
    /**
     * @summary The content.
     * @description The content of the translation.
     */
    readonly content?: string
    /**
     * @summary The prize.
     * @description The prize of the translation.
     */
    readonly prize?: string
}

export type { ITestingThingsTranslationUpdatePayload }
