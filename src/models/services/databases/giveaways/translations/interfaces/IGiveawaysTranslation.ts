import type { IBaseEntity } from "../../../base/interfaces/IBaseEntity"
import type { DatabaseIdentifier } from "../../../base/types/DatabaseIdentifier"
import type { Language } from "../../../base/enums/Language"

/**
 * @summary The giveaways translation interface.
 * @description This interface is used to store the giveaways translation.
 */
interface IGiveawaysTranslation extends IBaseEntity {
    /**
     * @summary The giveaway ID.
     * @description The giveaway ID, the giveaway that is being translated.
     */
    readonly giveawayId: DatabaseIdentifier
    /**
     * @summary The language.
     * @description The language, the language of the translation.
     */
    readonly language: Language
    /**
     * @summary The title.
     * @description The title, the title of the translation.
     */
    readonly title: string
    /**
     * @summary The content.
     * @description The content, the content of the translation.
     */
    readonly content: string
    /**
     * @summary The prize.
     * @description The prize, the prize of the translation.
     */
    readonly prize: string
}

export type { IGiveawaysTranslation }
