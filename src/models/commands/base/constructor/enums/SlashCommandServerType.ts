/**
 * @summary Types of slash command server.
 * @description Used to determine on which server(s) is the command available.
 */
const enum SlashCommandServerType {
    /**
     * @summary Public server.
     * @description The command is available only on the public Discord server.
     */
    PUBLIC = "PUBLIC",
    /**
     * @summary Private server.
     * @description The command is available only on the private Discord server.
     */
    PRIVATE = "PRIVATE",
    /**
     * @summary Both servers.
     * @description The command is available on both the public and private Discord servers.
     */
    BOTH = "BOTH",
}

export { SlashCommandServerType }
