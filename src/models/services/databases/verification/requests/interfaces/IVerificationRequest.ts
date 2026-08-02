import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { IBaseEntity } from "../../../base/interfaces/IBaseEntity"
import type { VerificationRequestState } from "../enums/VerificationRequestState"

/**
 * @summary Represents a verification request.
 * @description This interface is used to store the verification request.
 */
interface IVerificationRequest extends IBaseEntity {
    /**
     * @summary The ID of the user.
     * @description Discord's identifier for the user (e.g. "123456789012345678").
     */
    readonly userId: DiscordSnowflake
    /**
     * @summary The ID of the guild.
     * @description Discord's identifier for the guild (e.g. "123456789012345678").
     */
    readonly guildId: DiscordSnowflake
    /**
     * @summary The comment of the verification request.
     * @description The comment of the verification request (e.g. "I want to join to the community to test the bot.").
     */
    readonly comment: string
    /**
     * @summary The state of the verification request.
     * @description The state of the verification request (e.g. OPENED, CLOSED, etc.).
     */
    readonly state: VerificationRequestState
}

export type { IVerificationRequest }
