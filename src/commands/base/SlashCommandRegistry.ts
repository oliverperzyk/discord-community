import { SlashCommandServerType } from "@/oliverperzyk/models/commands/base/constructor/enums/SlashCommandServerType"
import type { BaseSlashCommand } from "./BaseSlashCommand"
import { DiscordApplicationInstanceManager } from "@/oliverperzyk/globals/managers/DiscordApplicationInstanceManager"
import { Routes } from "discord.js"
import { EnvironmentVariables } from "@/oliverperzyk/globals/EnvironmentVariables"
import { PrivateGuildConfiguration } from "@/oliverperzyk/globals/configuration/guilds/PrivateGuildConfiguration"
import { SlowdownPrivateCommand } from "../private/moderation/SlowdownPrivateCommand"
import { GeneralVerificationPrivateCommand } from "../private/verification/GeneralVerificationPrivateCommand"

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
    private static readonly COMMANDS: BaseSlashCommand[] = [
        // Private commands.
        new SlowdownPrivateCommand(),
        new GeneralVerificationPrivateCommand(),
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
     * @summary Register all slash commands to the Discord API.
     * @description This method registers all slash commands to the Discord API.
     */
    public static async registerCommands(): Promise<void> {
        const privateCommands: BaseSlashCommand[] = []
        const applicationCommands: BaseSlashCommand[] = []

        for (const command of this.COMMANDS) {
            switch (command.serverType) {
                case SlashCommandServerType.PRIVATE:
                    privateCommands.push(command)
                    break
                case SlashCommandServerType.APPLICATION:
                    applicationCommands.push(command)
                    break
                case SlashCommandServerType.ALL_SERVERS:
                    privateCommands.push(command)
                    break
            }
        }

        await Promise.all([
            await DiscordApplicationInstanceManager.instance.rest.put(
                Routes.applicationCommands(EnvironmentVariables.DISCORD_APPLICATION_IDENTIFIER),
                {
                    body: applicationCommands.map((command: BaseSlashCommand) => command.structure.toJSON()),
                },
            ),
            await DiscordApplicationInstanceManager.instance.rest.put(
                Routes.applicationGuildCommands(
                    EnvironmentVariables.DISCORD_APPLICATION_IDENTIFIER,
                    PrivateGuildConfiguration.guildId,
                ),
                {
                    body: privateCommands.map((command: BaseSlashCommand) => command.structure.toJSON()),
                },
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
    public static findCommand(name: string, guildId: string | null | undefined): BaseSlashCommand | null {
        const serverType: SlashCommandServerType = guildId
            ? this.SERVER_TYPE_MAP.get(guildId.trim())!
            : SlashCommandServerType.APPLICATION
        return (
            this.COMMANDS.find(
                ({ structure, serverType: commandServerType }) =>
                    structure.name === name &&
                    (serverType === commandServerType ||
                        commandServerType === SlashCommandServerType.APPLICATION ||
                        commandServerType === SlashCommandServerType.ALL_SERVERS),
            ) ?? null
        )
    }
}

export { SlashCommandRegistry }
