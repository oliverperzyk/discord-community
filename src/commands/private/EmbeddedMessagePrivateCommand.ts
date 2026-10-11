import { SlashCommandServerType } from "@/oliverperzyk/models/commands/base/constructor/enums/SlashCommandServerType"
import { BaseSlashCommand } from "../base/BaseSlashCommand"
import type { SlashCommandStructureType } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandStructureType"
import {
    type ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
    SlashCommandStringOption,
    TextDisplayBuilder,
    PermissionFlagsBits,
} from "discord.js"
import type { SlashCommandPermissionFlag } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandPermissionFlag"

/**
 * @summary The command to embed a message in the channel.
 * @description This command is used to embed a message in the channel.
 */
class EmbeddedMessagePrivateCommand extends BaseSlashCommand {
    /**
     * @summary The server type of the command.
     * @description The server type of the command.
     */
    public override readonly serverType = SlashCommandServerType.PRIVATE

    /**
     * @summary The structure of the command.
     * @description The structure of the command.
     */
    public readonly structure: SlashCommandStructureType = new SlashCommandBuilder()
        .setName("embedded-message")
        .setDescription("Embeds a message in the current channel.")
        .addStringOption((option: SlashCommandStringOption) =>
            option
                .setName("message")
                .setDescription("The type of the message to embed in the current channel.")
                .setRequired(true)
                .addChoices(
                    {
                        name: "Information",
                        value: "information",
                    },
                    {
                        name: "Social Posts",
                        value: "social-posts",
                    },
                    {
                        name: "Testing Things",
                        value: "testing-things",
                    },
                    {
                        name: "Voice Channels",
                        value: "voice-channels",
                    },
                    {
                        name: "Message Trap",
                        value: "message-trap",
                    },
                ),
        )

    /**
     * @summary The required permissions of the command.
     * @description Required permissions to execute the command.
     */
    public override readonly requiredPermissions: readonly SlashCommandPermissionFlag[] = [
        PermissionFlagsBits.Administrator,
    ]

    /**
     * @summary The function to execute when the command is invoked.
     * @description The function to execute when the command is invoked.
     * @param interaction - The interaction that triggered the command.
     * @returns The result of the command execution.
     */
    public async onExecute(interaction: ChatInputCommandInteraction): Promise<void> {
        const selectedMessageType: string = interaction.options.getString("message", true)
        try {
            switch (selectedMessageType) {
                case "information":
                    break
                case "social-posts":
                    break
                case "testing-things":
                    break
                case "voice-channels":
                    break
                case "message-trap":
                    break
            }

            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        "The embedded message has been successfully sent in the current channel.",
                    ),
                ],
            })
        } catch {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        "An error occurred while sending the embedded message. Please try again later.",
                    ),
                ],
            })
        }
    }
}

export { EmbeddedMessagePrivateCommand }
