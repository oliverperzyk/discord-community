import type { Language } from "../../../base/enums/Language"

/**
 * @summary The personalization upsert payload interface.
 * @description This interface is used to upsert a personalization.
 */
interface IPersonalizationUpsertPayload {
    /**
     * @summary The language.
     * @description The language, that user will see some of the messages in.
     */
    readonly language?: Language
}

export type { IPersonalizationUpsertPayload }
