import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary Represents the payload for creating the verification state.
 * @description This interface is used to create the verification state of the guild.
 */
interface IVerificationStateCreatePayload {
    /**
     * @summary The ID of the guild.
     * @description The ID of the guild to create the verification state for.
     */
    readonly guildId: DiscordSnowflake
    /**
     * @summary Whether the verification is enabled.
     * @description Whether the verification is enabled in this guild. This is a required field.
     */
    readonly enabled: boolean
    /**
     * @summary The ID of the role.
     * @description The ID of the role that will be assigned to the user after verification.
     */
    readonly roleId: DiscordSnowflake
}

export type { IVerificationStateCreatePayload }
