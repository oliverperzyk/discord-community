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
     * @summary Application commands.
     * @description The command is available on all Discord servers, as a global application command.
     */
    APPLICATION = "APPLICATION",
    /**
     * @summary All servers.
     * @description The command is available on all Discord servers, but is not a global application command.
     */
    ALL_SERVERS = "ALL_SERVERS",
}

export { SlashCommandServerType }
