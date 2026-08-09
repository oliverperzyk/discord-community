import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { PersonalizationLanguage } from "../enums/PersonalizationLanguage"

/**
 * @summary The personalization create payload interface.
 * @description This interface is used to create a personalization.
 */
interface IPersonalizationCreatePayload {
    /**
     * @summary The user's identifier.
     * @description The user's identifier, the user's identifier of the personalization settings.
     */
    readonly id: DiscordSnowflake
    /**
     * @summary The language.
     * @description The language, that user will see some of the messages in.
     */
    readonly language: PersonalizationLanguage
}

export type { IPersonalizationCreatePayload }
