import { SlashCommandServerType } from "@/oliverperzyk/models/commands/base/constructor/enums/SlashCommandServerType"
import type { BaseSlashCommand } from "./BaseSlashCommand"
import { DiscordApplicationInstanceManager } from "@/oliverperzyk/globals/managers/DiscordApplicationInstanceManager"
import { PermissionsBitField, Routes, SlashCommandBuilder } from "discord.js"
import { EnvironmentVariables } from "@/oliverperzyk/globals/EnvironmentVariables"

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
                Routes.applicationGuildCommands(EnvironmentVariables.DISCORD_APPLICATION_IDENTIFIER, "to-be-added"),
                {
                    body: publicCommands.map((command: BaseSlashCommand) => command.structure.toJSON()),
                },
            ),
            await DiscordApplicationInstanceManager.instance.rest.put(
                Routes.applicationGuildCommands(EnvironmentVariables.DISCORD_APPLICATION_IDENTIFIER, "to-be-added"),
                {
                    body: privateCommands.map((command: BaseSlashCommand) => command.structure.toJSON()),
                },
            ),
        ])
    }

    /**
     * @summary Register the badge command to the Discord API.
     * @description This method registers the badge command to the Discord API.
     */
    public static async registerCommandForBadge(): Promise<void> {
        await DiscordApplicationInstanceManager.instance.rest.put(
            Routes.applicationCommand(EnvironmentVariables.DISCORD_APPLICATION_IDENTIFIER, "to-be-added"),
            {
                body: new SlashCommandBuilder()
                    .setName("badge")
                    .setDescription("This command is so I can have a badge on my Discord profile.")
                    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
            },
        )
    }
}

export { SlashCommandRegistry }
