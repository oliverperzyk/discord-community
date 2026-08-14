import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { IBaseEntity } from "../../../base/interfaces/IBaseEntity"
import type { ModeratorsPunishmentType } from "../enums/ModeratorsPunishmentType"

/**
 * @summary The moderators punishment interface.
 * @description This interface is used to store the moderator's punishment.
 */
interface IModeratorsPunishment extends IBaseEntity {
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
    readonly comment: string | null
    /**
     * @summary The expires at.
     * @description The expires at, the date and time when the punishment expires.
     * @remarks If the punishment is permanent, the expires at will be `null`.
     */
    readonly expiresAt: Date | null
}

export type { IModeratorsPunishment }
