import { SlashCommandServerType } from "@/oliverperzyk/models/commands/base/constructor/enums/SlashCommandServerType"
import type { BaseSlashCommand } from "./BaseSlashCommand"
import { DiscordApplicationInstanceManager } from "@/oliverperzyk/globals/managers/DiscordApplicationInstanceManager"
import { Routes } from "discord.js"
import { EnvironmentVariables } from "@/oliverperzyk/globals/EnvironmentVariables"
import { PrivateGuildConfiguration } from "@/oliverperzyk/globals/configuration/guilds/PrivateGuildConfiguration"
import { PublicGuildConfiguration } from "@/oliverperzyk/globals/configuration/guilds/PublicGuildConfiguration"

/**
 * @summary Registry of slash commands.
 * @description This class is used to register slash commands to the Discord API.
 */
class SlashCommandRegistry {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}
    /**
     * @summary The commands to register.
     * @description The commands to register.
     */
    private static readonly COMMANDS: BaseSlashCommand[] = []

    /**
     * @summary The server type map.
     * @description The server type map, it's used to match server's type to it's guild identifier.
     */
    private static readonly SERVER_TYPE_MAP: ReadonlyMap<string, SlashCommandServerType> = new Map<
        string,
        SlashCommandServerType
    >([
        [PublicGuildConfiguration.guildId, SlashCommandServerType.PUBLIC],
        [PrivateGuildConfiguration.guildId, SlashCommandServerType.PRIVATE],
    ])

    /**
     * @summary Register all slash commands to the Discord API.
     * @description This method registers all slash commands to the Discord API.
     */
    public static async registerCommands(): Promise<void> {
        const publicCommands: BaseSlashCommand[] = []
        const privateCommands: BaseSlashCommand[] = []

        for (const command of this.COMMANDS) {
            if (command.serverType !== SlashCommandServerType.PRIVATE) {
                publicCommands.push(command)
            }
            if (command.serverType !== SlashCommandServerType.PUBLIC) {
                privateCommands.push(command)
            }
        }

        await Promise.all([
            await DiscordApplicationInstanceManager.instance.rest.put(
                Routes.applicationGuildCommands(
                    EnvironmentVariables.DISCORD_APPLICATION_IDENTIFIER,
                    PublicGuildConfiguration.guildId,
                ),
                {
                    body: publicCommands.map((command: BaseSlashCommand) => command.structure.toJSON()),
                },
            ),
            // await DiscordApplicationInstanceManager.instance.rest.put(
            //     Routes.applicationGuildCommands(
            //         EnvironmentVariables.DISCORD_APPLICATION_IDENTIFIER,
            //         PrivateGuildConfiguration.guildId,
            //     ),
            //     {
            //         body: privateCommands.map((command: BaseSlashCommand) => command.structure.toJSON()),
            //     },
            // ),
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
            : SlashCommandServerType.BOTH
        return (
            this.COMMANDS.find(
                ({ structure, serverType: commandServerType }) =>
                    structure.name === name && serverType === commandServerType,
            ) ?? null
        )
    }
}

export { SlashCommandRegistry }
