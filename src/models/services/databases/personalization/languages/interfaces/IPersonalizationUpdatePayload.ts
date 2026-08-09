import type { PersonalizationLanguage } from "../enums/PersonalizationLanguage"

/**
 * @summary The personalization update payload interface.
 * @description This interface is used to update a personalization.
 */
interface IPersonalizationUpdatePayload {
    /**
     * @summary The language.
     * @description The language, that user will see some of the messages in.
     */
    readonly language: PersonalizationLanguage
}

export type { IPersonalizationUpdatePayload }
