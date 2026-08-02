/**
 * @summary Represents the base guild configuration.
 * @description This interface is used to store the base guild configuration.
 */
interface IBaseGuildConfiguration {
    /**
     * @summary The schema of the base guild configuration.
     * @description Indicates the schema of the base guild configuration for IDEs.
     */
    readonly $schema: string
    /**
     * @summary The ID of the guild.
     * @description Discord's identifier for the guild.
     */
    readonly guildId: string
}

export type { IBaseGuildConfiguration }
