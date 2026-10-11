import { SlashCommandServerType } from "@/oliverperzyk/models/commands/base/constructor/enums/SlashCommandServerType"
import { SlashCommandError } from "@/oliverperzyk/models/builders/process-errors/SlashCommandError"
import type { BaseSlashCommand } from "./BaseSlashCommand"
import { BaseGuildSlashCommand } from "./BaseGuildSlashCommand"
import { DiscordSnowflakeDataManager } from "@/oliverperzyk/globals/managers/data/base/DiscordSnowflakeDataManager"
import { DiscordApplicationInstanceManager } from "@/oliverperzyk/globals/managers/DiscordApplicationInstanceManager"
import { Routes } from "discord.js"
import { EnvironmentVariables } from "@/oliverperzyk/globals/EnvironmentVariables"
import { PrivateGuildConfiguration } from "@/oliverperzyk/globals/configuration/guilds/PrivateGuildConfiguration"
import { SlowdownPrivateCommand } from "../guilds/all/SlowdownPrivateCommand"
import { GeneralVerificationPrivateCommand } from "../private/verification/GeneralVerificationPrivateCommand"
import { EmbeddedMessagePrivateCommand } from "../private/EmbeddedMessagePrivateCommand"

/**
 * @summary Slash commands supported by the registry.
 */
type RegisteredSlashCommand = BaseSlashCommand | BaseGuildSlashCommand

/**
 * @summary Registry of slash commands.
 * @description This class is used to register slash commands to the Discord API.
 */
class SlashCommandRegistry {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}
    /**
     * @summary The commands to register.
     * @description The commands to register.
     */
    private static readonly COMMANDS: RegisteredSlashCommand[] = [
        // Private commands.
        new SlowdownPrivateCommand(),
        new GeneralVerificationPrivateCommand(),
        new EmbeddedMessagePrivateCommand(),
    ]

    /**
     * @summary The server type map.
     * @description The server type map, it's used to match server's type to it's guild identifier.
     */
    private static readonly SERVER_TYPE_MAP: ReadonlyMap<string, SlashCommandServerType> = new Map<
        string,
        SlashCommandServerType
    >([[PrivateGuildConfiguration.guildId, SlashCommandServerType.PRIVATE]])

    /**
     * @summary Validate slash command names.
     * @description Requires unique names within a registration scope, including names reserved by application commands.
     * @param commands - The commands registered in the scope.
     * @param guildId - The guild identifier, or undefined for application commands.
     * @param reservedNames - Command names already available in the scope.
     * @returns The validated names, including reserved names.
     */
    private static validateCommandNames(
        commands: readonly RegisteredSlashCommand[],
        guildId?: string,
        reservedNames: ReadonlySet<string> = new Set(),
    ): ReadonlySet<string> {
        const commandNames: Set<string> = new Set(reservedNames)
        for (const command of commands) {
            const commandName: string = command.structure.name
            if (commandNames.has(commandName)) {
                throw guildId === undefined
                    ? SlashCommandError.fromDuplicateApplicationCommand(commandName)
                    : SlashCommandError.fromDuplicateGuildCommand(commandName, guildId)
            }
            commandNames.add(commandName)
        }
        return commandNames
    }

    /**
     * @summary Register all slash commands to the Discord API.
     * @description This method registers all slash commands to the Discord API.
     */
    public static async registerCommands(): Promise<void> {
        const guildCommands: Map<string, RegisteredSlashCommand[]> = new Map([[PrivateGuildConfiguration.guildId, []]])
        const applicationCommands: RegisteredSlashCommand[] = []
        const allGuildsCommands: RegisteredSlashCommand[] = []

        for (const command of this.COMMANDS) {
            switch (command.serverType) {
                case SlashCommandServerType.PRIVATE:
                    guildCommands.get(PrivateGuildConfiguration.guildId)!.push(command)
                    break
                case SlashCommandServerType.GUILD_SCOPED: {
                    const commandName: string = command.structure.name
                    if (!(command instanceof BaseGuildSlashCommand)) {
                        throw SlashCommandError.fromInvalidGuildScopedCommand(commandName)
                    }
                    for (const guildId of command.AVAILABLE_IN) {
                        const commands: RegisteredSlashCommand[] = guildCommands.get(guildId) ?? []
                        commands.push(command)
                        guildCommands.set(guildId, commands)
                    }
                    break
                }
                case SlashCommandServerType.APPLICATION:
                    applicationCommands.push(command)
                    break
                case SlashCommandServerType.ALL_GUILDS:
                    allGuildsCommands.push(command)
                    break
            }
        }

        const applicationNames: ReadonlySet<string> = this.validateCommandNames(applicationCommands)
        for (const [guildId, commands] of guildCommands) {
            commands.push(...allGuildsCommands)
            this.validateCommandNames(commands, guildId, applicationNames)
        }

        await Promise.all([
            DiscordApplicationInstanceManager.instance.rest.put(
                Routes.applicationCommands(EnvironmentVariables.DISCORD_APPLICATION_IDENTIFIER),
                {
                    body: applicationCommands.map((command: RegisteredSlashCommand) => command.structure.toJSON()),
                },
            ),
            ...Array.from(guildCommands, ([guildId, commands]) =>
                DiscordApplicationInstanceManager.instance.rest.put(
                    Routes.applicationGuildCommands(EnvironmentVariables.DISCORD_APPLICATION_IDENTIFIER, guildId),
                    {
                        body: commands.map((command: RegisteredSlashCommand) => command.structure.toJSON()),
                    },
                ),
            ),
        ])
    }

    /**
     * @summary Finds a command by it's name.
     * @description It's used by command handler later.
     * @param name - Name of a command.
     * @param guildId - Guild identifier, which will be used to determine the server type of a command.
     * @returns Instance of a command or null, if it does not exist.
     */
    public static findCommand(name: string, guildId: string | null | undefined): RegisteredSlashCommand | null {
        const normalizedGuildId: string | undefined = guildId?.trim()
        const serverType: SlashCommandServerType | undefined = normalizedGuildId
            ? this.SERVER_TYPE_MAP.get(normalizedGuildId)
            : SlashCommandServerType.APPLICATION
        return (
            this.COMMANDS.find((command: RegisteredSlashCommand): boolean => {
                if (command.structure.name !== name) return false
                if (command.serverType === SlashCommandServerType.GUILD_SCOPED) {
                    return (
                        command instanceof BaseGuildSlashCommand &&
                        DiscordSnowflakeDataManager.isDiscordSnowflake(normalizedGuildId) &&
                        command.AVAILABLE_IN.has(normalizedGuildId)
                    )
                }
                return (
                    serverType === command.serverType ||
                    command.serverType === SlashCommandServerType.APPLICATION ||
                    command.serverType === SlashCommandServerType.ALL_GUILDS
                )
            }) ?? null
        )
    }
}

export { SlashCommandRegistry }
