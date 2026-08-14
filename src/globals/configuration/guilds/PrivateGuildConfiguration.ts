import type { IPrivateGuild } from "@/oliverperzyk/models/globals/configuration/guilds/interfaces/IPrivateGuild"
import type { Guild } from "discord.js"
import { ConfigurationManager } from "../../managers/ConfigurationManager"
import { DiscordApplicationInstanceManager } from "../../managers/DiscordApplicationInstanceManager"

/**
 * @summary Represents the private guild configuration.
 * @description This class is used to store the private guild configuration.
 */
class PrivateGuildConfiguration {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Resolves the internal configuration.
     * @description This method is used to resolve the internal configuration.
     * @returns The internal configuration.
     */
    private static resolveInternalConfiguration(): Readonly<Omit<IPrivateGuild, "$schema">> {
        const configuration: IPrivateGuild = ConfigurationManager.getConfiguration(
            "configuration/guilds/PrivateGuild.jsonc",
        )

        const { $schema: _, ...rest } = configuration
        return rest
    }

    /**
     * @summary The internal configuration.
     * @description This is the internal configuration for the private guild.
     */
    private static readonly interalConfiguration: Readonly<Omit<IPrivateGuild, "$schema">> =
        this.resolveInternalConfiguration()

    /**
     * @summary The ID of the guild.
     * @description Discord's identifier for the guild.
     */
    public static readonly guildId: string = this.interalConfiguration.guildId

    /**
     * @summary The roles of the guild.
     * @description This object contains the roles of the guild.
     */
    public static readonly roles: Readonly<IPrivateGuild["roles"]> = this.interalConfiguration.roles

    /**
     * @summary The channels of the guild.
     * @description This object contains the channels of the guild.
     */
    public static readonly channels: Readonly<IPrivateGuild["channels"]> = this.interalConfiguration.channels

    /**
     * @summary The categories of the guild.
     * @description This object contains the categories of the guild.
     */
    public static readonly categories: Readonly<IPrivateGuild["categories"]> = this.interalConfiguration.categories

    /**
     * @summary The instance of the guild.
     * @description Resolves the guild instance from the cache or fetches it from the Discord API.
     * @returns The guild instance, that you can use to interact with the guild.
     */
    public static async instance(): Promise<Guild> {
        const cachedGuild: Guild | undefined = DiscordApplicationInstanceManager.instance.guilds.cache.get(this.guildId)
        if (cachedGuild) return cachedGuild

        const guild: Guild = await DiscordApplicationInstanceManager.instance.guilds.fetch(this.guildId)
        DiscordApplicationInstanceManager.instance.guilds.cache.set(this.guildId, guild)
        return guild
    }
}

export { PrivateGuildConfiguration }
