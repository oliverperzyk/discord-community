import { SlashCommandServerType } from "@/oliverperzyk/models/commands/base/constructor/enums/SlashCommandServerType"
import { BaseSlashCommand } from "../../base/BaseSlashCommand"
import type { SlashCommandStructureType } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandStructureType"
import {
    BaseGuildTextChannel,
    type ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
    type SlashCommandIntegerOption,
    TextDisplayBuilder,
} from "discord.js"
import type { SlashCommandPermissionFlag } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandPermissionFlag"

/**
 * @summary Private command to set the slowdown for the current channel.
 * @description This command is used to set the slowdown for the current channel.
 */
class SlowdownPrivateCommand extends BaseSlashCommand {
    /**
     * @summary The server type of the command.
     * @description The server(s) on which the command is available.
     */
    public override readonly serverType = SlashCommandServerType.ALL_GUILDS

    /**
     * @summary The structure of the command.
     * @description The structure of the command used by Discord API to register the command.
     */
    public override readonly structure: SlashCommandStructureType = new SlashCommandBuilder()
        .setName("slowdown")
        .setDescription("Sets the slowdown for the current channel.")
        .addIntegerOption((option: SlashCommandIntegerOption) =>
            option
                .setName("seconds")
                .setDescription("Seconds to slow down the users' messages.")
                .setMinValue(0)
                .setMaxValue(59),
        )
        .addIntegerOption((option: SlashCommandIntegerOption) =>
            option
                .setName("minutes")
                .setDescription("Minutes to slow down the users' messages.")
                .setMinValue(0)
                .setMaxValue(59)
                .setRequired(false),
        )
        .addIntegerOption((option: SlashCommandIntegerOption) =>
            option
                .setName("hours")
                .setDescription("Hours to slow down the users' messages.")
                .setMinValue(0)
                .setMaxValue(6)
                .setRequired(false),
        )

    /**
     * @summary The required permissions of the command.
     * @description The required permissions of the command, in order to execute it successfully.
     */
    public override readonly requiredPermissions: readonly SlashCommandPermissionFlag[] = [
        PermissionFlagsBits.ManageChannels,
    ]

    /**
     * @summary The function to execute when the command is invoked.
     * @description The function to execute when the command is invoked. It should be overridden by the subclass.
     * @param interaction - The interaction that triggered the command.
     * @returns The result of the command execution.
     */
    public async onExecute(interaction: ChatInputCommandInteraction): Promise<void> {
        const seconds: number = interaction.options.getInteger("seconds", false) ?? 0
        const minutes: number = interaction.options.getInteger("minutes", false) ?? 0
        const hours: number = interaction.options.getInteger("hours", false) ?? 0

        const slowdown: number = seconds + minutes * 60 + hours * 3600
        if (!interaction.channel?.isTextBased() || !(interaction.channel instanceof BaseGuildTextChannel)) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        "Invalid channel. Please use a text channel to set the slowdown.",
                    ),
                ],
            })
            return
        }

        await interaction.channel.setRateLimitPerUser(slowdown)
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [
                new TextDisplayBuilder().setContent("Slowdown has been successfully changed for this channel."),
            ],
        })
    }
}

export { SlowdownPrivateCommand }
