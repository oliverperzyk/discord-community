/**
 * @summary Types of slash command server.
 * @description Used to determine on which server(s) is the command available.
 */
const enum SlashCommandServerType {
    /**
     * @summary Public server.
     * @description The command is available only on the public Discord server(s).
     */
    PUBLIC = "PUBLIC",
    /**
     * @summary Private server.
     * @description The command is available only on the private Discord server.
     */
    PRIVATE = "PRIVATE",
    /**
     * @summary Selected guilds.
     * @description The command is available only in the guilds specified by its AVAILABLE_IN set.
     */
    GUILD_SCOPED = "GUILD_SCOPED",
    /**
     * @summary Application commands.
     * @description The command is available on all Discord servers, as a global application command.
     */
    APPLICATION = "APPLICATION",
    /**
     * @summary All guilds.
     * @description The command is available in all Discord guilds, but is not a global application command.
     */
    ALL_GUILDS = "ALL_GUILDS",
}

export { SlashCommandServerType }
