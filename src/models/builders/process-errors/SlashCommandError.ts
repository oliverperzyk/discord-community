/**
 * @summary Error class for slash command errors.
 * @description Identifies errors related to slash commands and the command that caused them.
 */
class SlashCommandError extends Error {
    /**
     * @summary The name of the slash command that caused the error.
     */
    public readonly commandName: string

    /**
     * @summary Constructor.
     * @description Creates a new error related to a slash command.
     * @param message - The message of the error.
     * @param commandName - The name of the command that caused the error.
     */
    public constructor(message: string, commandName: string) {
        super(message)
        this.commandName = commandName
        this.name = "SlashCommandError"
        Object.setPrototypeOf(this, SlashCommandError.prototype)
    }

    /**
     * @summary Create an error for an invalid guild-scoped command.
     * @description Identifies a guild-scoped command that does not extend its required base class.
     * @param commandName - The name of the invalid command.
     * @returns The SlashCommandError instance.
     */
    public static fromInvalidGuildScopedCommand(commandName: string): SlashCommandError {
        return new this(`Guild-scoped command "${commandName}" must extend BaseGuildSlashCommand.`, commandName)
    }

    /**
     * @summary Create an error for a duplicate application command.
     * @description Identifies a command name declared more than once in the application scope.
     * @param commandName - The duplicate command name.
     * @returns The SlashCommandError instance.
     */
    public static fromDuplicateApplicationCommand(commandName: string): SlashCommandError {
        return new this(`Application slash command "${commandName}" is declared more than once.`, commandName)
    }

    /**
     * @summary Create an error for a duplicate guild command.
     * @description Identifies a command name with overlapping availability in a guild.
     * @param commandName - The duplicate command name.
     * @param guildId - The identifier of the guild with the conflicting command name.
     * @returns The SlashCommandError instance.
     */
    public static fromDuplicateGuildCommand(commandName: string, guildId: string): SlashCommandError {
        return new this(`Slash command "${commandName}" is declared more than once in guild "${guildId}".`, commandName)
    }
}

export { SlashCommandError }
