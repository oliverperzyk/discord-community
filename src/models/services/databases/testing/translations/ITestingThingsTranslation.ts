import type { IBaseEntity } from "../../base/interfaces/IBaseEntity"
import type { Language } from "../../base/enums/Language"
import type { DatabaseIdentifier } from "../../base/types/DatabaseIdentifier"

/**
 * @summary The testing things translation interface.
 * @description This interface is used to store the testing things translation.
 */
interface ITestingThingsTranslation extends IBaseEntity {
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

export type { ITestingThingsTranslation }
