import type { Language } from "../../base/enums/Language"
import type { DatabaseIdentifier } from "../../base/types/DatabaseIdentifier"

/**
 * @summary The testing things translation create payload interface.
 * @description This interface is used to create a testing things translation.
 */
interface ITestingThingsTranslationCreatePayload {
    /**
     * @summary The language.
     * @description The language of the translation.
     */
    readonly language: Language
    /**
     * @summary The testing thing ID.
     * @description ID of the testing thing.
     */
    readonly testingThingId: DatabaseIdentifier
    /**
     * @summary The title.
     * @description The title of the translation.
     */
    readonly title: string
    /**
     * @summary The content.
     * @description The content of the translation.
     */
    readonly content: string
    /**
     * @summary The prize.
     * @description The prize of the translation.
     */
    readonly prize: string
}

export type { ITestingThingsTranslationCreatePayload }
