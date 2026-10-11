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
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
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
    public readonly serverType: SlashCommandServerType = SlashCommandServerType.PRIVATE

    /**
     * @summary The structure of the command.
     * @description The structure of the command.
     */
    public readonly structure: SlashCommandStructureType = new SlashCommandBuilder()
        .setName("embedded-message")
        .setNameLocalizations(BaseSlashCommand.generateCommandsTranslations("commands.embedded-message.name"))
        .setDescription(BaseSlashCommand.generateCommandTranslation("commands.embedded-message.description"))
        .setDescriptionLocalizations(
            BaseSlashCommand.generateCommandsTranslations("commands.embedded-message.description"),
        )
        .addStringOption((option: SlashCommandStringOption) =>
            option
                .setName("message")
                .setNameLocalizations(
                    BaseSlashCommand.generateCommandsTranslations("commands.embedded-message.message.name"),
                )
                .setDescription(
                    BaseSlashCommand.generateCommandTranslation("commands.embedded-message.message.description"),
                )
                .setDescriptionLocalizations(
                    BaseSlashCommand.generateCommandsTranslations("commands.embedded-message.message.description"),
                )
                .setRequired(true)
                .addChoices(
                    {
                        name: BaseSlashCommand.generateCommandTranslation(
                            "commands.embedded-message.message.choices.information",
                        ),
                        name_localizations: BaseSlashCommand.generateCommandsTranslations(
                            "commands.embedded-message.message.choices.information",
                        ),
                        value: "information",
                    },
                    {
                        name: BaseSlashCommand.generateCommandTranslation(
                            "commands.embedded-message.message.choices.social-posts",
                        ),
                        name_localizations: BaseSlashCommand.generateCommandsTranslations(
                            "commands.embedded-message.message.choices.social-posts",
                        ),
                        value: "social-posts",
                    },
                    {
                        name: BaseSlashCommand.generateCommandTranslation(
                            "commands.embedded-message.message.choices.testing-things",
                        ),
                        name_localizations: BaseSlashCommand.generateCommandsTranslations(
                            "commands.embedded-message.message.choices.testing-things",
                        ),
                        value: "testing-things",
                    },
                    {
                        name: BaseSlashCommand.generateCommandTranslation(
                            "commands.embedded-message.message.choices.voice-channels",
                        ),
                        name_localizations: BaseSlashCommand.generateCommandsTranslations(
                            "commands.embedded-message.message.choices.voice-channels",
                        ),
                        value: "voice-channels",
                    },
                    {
                        name: BaseSlashCommand.generateCommandTranslation(
                            "commands.embedded-message.message.choices.message-trap",
                        ),
                        name_localizations: BaseSlashCommand.generateCommandsTranslations(
                            "commands.embedded-message.message.choices.message-trap",
                        ),
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
        const replyLanguage: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
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
                        TranslationsManager.translate({
                            key: "commands.embedded-message.message.success",
                            language: replyLanguage,
                        }),
                    ),
                ],
            })
        } catch {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({
                            key: "commands.embedded-message.message.error",
                            language: replyLanguage,
                        }),
                    ),
                ],
            })
        }
    }
}

export { EmbeddedMessagePrivateCommand }
