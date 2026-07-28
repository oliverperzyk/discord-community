import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { ModeratorsPunishmentType } from "../enums/ModeratorsPunishmentType"

/**
 * @summary The moderators punishment create payload interface.
 * @description This interface is used to create a moderators punishment.
 */
interface IModeratorsPunishmentCreatePayload {
    /**
     * @summary The user ID.
     * @description The user ID, the user that is being punished.
     */
    readonly userId: DiscordSnowflake
    /**
     * @summary The guild ID.
     * @description The guild ID, the guild that user is being punished in.
     */
    readonly guildId: DiscordSnowflake
    /**
     * @summary The type.
     * @description The type, the type of the punishment.
     */
    readonly type: ModeratorsPunishmentType
    /**
     * @summary The comment.
     * @description The comment, the comment of the punishment.
     */
    readonly comment: string
    /**
     * @summary The expires at.
     * @description The expires at, the date and time when the punishment expires.
     * @remarks If the punishment is permanent, the expires at will be `undefined`.
     */
    readonly expiresAt?: Date
}

export type { IModeratorsPunishmentCreatePayload }
