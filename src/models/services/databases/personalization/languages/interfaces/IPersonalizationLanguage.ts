import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { IBaseEntity } from "../../../base/interfaces/IBaseEntity"

/**
 * @summary The personalization language interface.
 * @description This interface is used to store the personalization language.
 */
interface IPersonalizationLanguage extends Omit<IBaseEntity, "id"> {
    /**
     * @summary The user's identifier.
     * @description The user's identifier, the user's identifier of the personalization language.
     */
    readonly id: DiscordSnowflake
    /**
     * @summary The language.
     * @description The language, the language of the personalization language.
     */
    readonly language: string
}

export type { IPersonalizationLanguage }
