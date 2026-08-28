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
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"

/**
 * @summary Private command to set the slowdown for the current channel.
 * @description This command is used to set the slowdown for the current channel.
 */
class SlowdownPrivateCommand extends BaseSlashCommand {
    /**
     * @summary The server type of the command.
     * @description The server(s) on which the command is available.
     */
    public override readonly serverType: SlashCommandServerType = SlashCommandServerType.PRIVATE

    /**
     * @summary The structure of the command.
     * @description The structure of the command used by Discord API to register the command.
     */
    public override readonly structure: SlashCommandStructureType = new SlashCommandBuilder()
        .setName("slowdown")
        .setNameLocalizations(BaseSlashCommand.generateCommandsTranslations("commands.slowdown.name"))
        .setDescription(BaseSlashCommand.generateCommandTranslation("commands.slowdown.description"))
        .setDescriptionLocalizations(BaseSlashCommand.generateCommandsTranslations("commands.slowdown.description"))
        .addIntegerOption((option: SlashCommandIntegerOption) =>
            option
                .setName("seconds")
                .setNameLocalizations(BaseSlashCommand.generateCommandsTranslations("commands.slowdown.seconds.name"))
                .setDescription(BaseSlashCommand.generateCommandTranslation("commands.slowdown.seconds.description"))
                .setDescriptionLocalizations(
                    BaseSlashCommand.generateCommandsTranslations("commands.slowdown.seconds.description"),
                )
                .setMinValue(0)
                .setMaxValue(59),
        )
        .addIntegerOption((option: SlashCommandIntegerOption) =>
            option
                .setName("minutes")
                .setNameLocalizations(BaseSlashCommand.generateCommandsTranslations("commands.slowdown.minutes.name"))
                .setDescription(BaseSlashCommand.generateCommandTranslation("commands.slowdown.minutes.description"))
                .setDescriptionLocalizations(
                    BaseSlashCommand.generateCommandsTranslations("commands.slowdown.minutes.description"),
                )
                .setMinValue(0)
                .setMaxValue(59)
                .setRequired(false),
        )
        .addIntegerOption((option: SlashCommandIntegerOption) =>
            option
                .setName("hours")
                .setNameLocalizations(BaseSlashCommand.generateCommandsTranslations("commands.slowdown.hours.name"))
                .setDescription(BaseSlashCommand.generateCommandTranslation("commands.slowdown.hours.description"))
                .setDescriptionLocalizations(
                    BaseSlashCommand.generateCommandsTranslations("commands.slowdown.hours.description"),
                )
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
        const language: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
        const seconds: number = interaction.options.getInteger("seconds", false) ?? 0
        const minutes: number = interaction.options.getInteger("minutes", false) ?? 0
        const hours: number = interaction.options.getInteger("hours", false) ?? 0

        const slowdown: number = seconds + minutes * 60 + hours * 3600
        if (!interaction.channel?.isTextBased() || !(interaction.channel instanceof BaseGuildTextChannel)) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({ key: "commands.slowdown.channel.invalid", language }),
                    ),
                ],
            })
            return
        }

        await interaction.channel.setRateLimitPerUser(slowdown)
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [
                new TextDisplayBuilder().setContent(
                    TranslationsManager.translate({
                        key: "commands.slowdown.success",
                        language,
                    }),
                ),
            ],
        })
    }
}

export { SlowdownPrivateCommand }
