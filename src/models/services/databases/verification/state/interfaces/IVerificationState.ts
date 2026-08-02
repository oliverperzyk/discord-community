import type { IBaseEntity } from "../../../base/interfaces/IBaseEntity"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary Represents the verification state.
 * @description This interface is used to store the verification state.
 */
interface IVerificationState extends IBaseEntity {
    /**
     * @summary The ID of the guild.
     * @description The ID of the guild.
     */
    readonly guildId: DiscordSnowflake
    /**
     * @summary Whether the verification is enabled.
     * @description Whether the verification is enabled.
     */
    readonly enabled: boolean
}

export type { IVerificationState }
