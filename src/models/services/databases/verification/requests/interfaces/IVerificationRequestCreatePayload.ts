import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary Represents the payload for creating a verification request.
 * @description This interface is used to store the payload for creating a verification request.
 */
interface IVerificationRequestCreatePayload {
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
}

export type { IVerificationRequestCreatePayload }
