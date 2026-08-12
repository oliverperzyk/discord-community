import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { IBaseEntity } from "../../../base/interfaces/IBaseEntity"
import type { Language } from "../../../base/enums/Language"

/**
 * @summary The personalization language interface.
 * @description This interface is used to store the personalization settings.
 */
interface IPersonalization extends Omit<IBaseEntity, "id"> {
    /**
     * @summary The user's identifier.
     * @description The user's identifier, the user's identifier of the personalization settings.
     */
    readonly id: DiscordSnowflake
    /**
     * @summary The language.
     * @description The language, that user will see some of the messages in.
     */
    readonly language: Language
}

export type { IPersonalization }
