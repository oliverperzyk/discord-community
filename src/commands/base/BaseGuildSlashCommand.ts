import { BaseSlashCommand } from "./BaseSlashCommand"
import { SlashCommandServerType } from "@/oliverperzyk/models/commands/base/constructor/enums/SlashCommandServerType"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary Base class for guild-scoped slash commands.
 * @description Restricts a slash command to the guilds specified by its AVAILABLE_IN set.
 */
abstract class BaseGuildSlashCommand extends BaseSlashCommand<SlashCommandServerType.GUILD_SCOPED> {
    /**
     * @summary The server type of the slash command.
     * @description Registers the command only in its selected guilds.
     */
    public override readonly serverType = SlashCommandServerType.GUILD_SCOPED

    /**
     * @summary The guilds in which the command is available.
     * @description An empty set makes the command unavailable in every guild.
     */
    public abstract readonly AVAILABLE_IN: ReadonlySet<DiscordSnowflake>
}

export { BaseGuildSlashCommand }
