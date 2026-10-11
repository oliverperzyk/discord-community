import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary Represents the payload for updating the verification state.
 * @description This interface is used to update the verification state.
 */
interface IVerificationStateUpdatePayload {
    /**
     * @summary Whether the verification is enabled.
     * @description Whether the verification is enabled in this guild.
     */
    readonly enabled?: boolean
    /**
     * @summary The ID of the role.
     * @description The ID of the role that will be assigned to the user after verification.
     */
    readonly roleId?: DiscordSnowflake
}

export type { IVerificationStateUpdatePayload }
