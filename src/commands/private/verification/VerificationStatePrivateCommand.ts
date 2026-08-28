import { SlashCommandServerType } from "@/oliverperzyk/models/commands/base/constructor/enums/SlashCommandServerType"
import { BaseSlashCommand } from "../../base/BaseSlashCommand"
import type { SlashCommandStructureType } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandStructureType"
import {
    type ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
    type SlashCommandStringOption,
    TextDisplayBuilder,
} from "discord.js"
import type { SlashCommandPermissionFlag } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandPermissionFlag"
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { VerificationStateService } from "@/oliverperzyk/services/databases/verification/VerificationStateService"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { IVerificationState } from "@/oliverperzyk/models/services/databases/verification/state/interfaces/IVerificationState"

/**
 * @summary The verification state private command.
 * @description This command is used to set the verification state for a guild.
 */
class VerificationStatePrivateCommand extends BaseSlashCommand {
    /**
     * @summary The server type of the command.
     * @description The type of server(s) on which the command is available.
     */
    public override readonly serverType: SlashCommandServerType = SlashCommandServerType.PRIVATE

    /**
     * @summary The structure of the command.
     * @description The structure of the command used by Discord API to register the command.
     */
    public override readonly structure: SlashCommandStructureType = new SlashCommandBuilder()
        .setName("verification-state")
        .setNameLocalizations(BaseSlashCommand.generateCommandsTranslations("commands.verification-state.name"))
        .setDescription(BaseSlashCommand.generateCommandTranslation("commands.verification-state.description"))
        .setDescriptionLocalizations(
            BaseSlashCommand.generateCommandsTranslations("commands.verification-state.description"),
        )
        .addStringOption((option: SlashCommandStringOption) =>
            option
                .setName("state")
                .setNameLocalizations(
                    BaseSlashCommand.generateCommandsTranslations("commands.verification-state.state.name"),
                )
                .setDescription(
                    BaseSlashCommand.generateCommandTranslation("commands.verification-state.state.description"),
                )
                .setDescriptionLocalizations(
                    BaseSlashCommand.generateCommandsTranslations("commands.verification-state.state.description"),
                )
                .setRequired(true)
                .addChoices(
                    {
                        name: "enabled",
                        name_localizations: BaseSlashCommand.generateCommandsTranslations(
                            "commands.verification-state.state.choices.enabled.name",
                        ),
                        value: "enabled",
                    },
                    {
                        name: "disabled",
                        name_localizations: BaseSlashCommand.generateCommandsTranslations(
                            "commands.verification-state.state.choices.disabled.name",
                        ),
                        value: "disabled",
                    },
                ),
        )

    /**
     * @summary The required permissions of the command.
     * @description The required permissions of the command, in order to execute it.
     */
    public override readonly requiredPermissions: readonly SlashCommandPermissionFlag[] = [
        PermissionFlagsBits.Administrator,
    ]

    /**
     * @summary Checks if the state is valid.
     * @description Checks if the state is valid.
     * @param state - The state to check.
     * @returns Whether the state is valid.
     */
    private static isValidState(state: unknown): state is "enabled" | "disabled" {
        return typeof state === "string" && (state === "enabled" || state === "disabled")
    }

    /**
     * @summary The function to execute when the command is invoked.
     * @description The function to execute when the command is invoked. It should be overridden by the subclass.
     * @param interaction - The interaction that triggered the command.
     * @returns The result of the command execution.
     */
    public override async onExecute(interaction: ChatInputCommandInteraction): Promise<void> {
        const language: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
        const state: unknown = interaction.options.getString("state", true)
        if (!VerificationStatePrivateCommand.isValidState(state)) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        "> " +
                            TranslationsManager.translate({
                                key: "commands.verification-state.state.invalid",
                                language,
                            }),
                    ),
                ],
            })
            return
        }

        const booleanState: boolean = state === "enabled"
        const verificationState: IVerificationState | null =
            await VerificationStateService.getVerificationStateByGuildId(interaction.guildId as DiscordSnowflake)
        if (verificationState === null || verificationState.enabled !== booleanState) {
            await VerificationStateService.setVerificationState(interaction.guildId as DiscordSnowflake, booleanState)
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        "> " +
                            TranslationsManager.translate({
                                key: "commands.verification-state.state.success",
                                language,
                                data: {
                                    state: TranslationsManager.translate({
                                        key:
                                            "commands.verification-state.state.choices." +
                                            (booleanState ? "enabled" : "disabled") +
                                            ".name",
                                        language,
                                    }),
                                },
                            }),
                    ),
                ],
            })
            return
        }

        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [
                new TextDisplayBuilder().setContent(
                    "> " +
                        TranslationsManager.translate({
                            key: "commands.verification-state.state.already",
                            language,
                            data: {
                                state: TranslationsManager.translate({
                                    key:
                                        "commands.verification-state.state.choices." +
                                        (booleanState ? "enabled" : "disabled") +
                                        ".name",
                                    language,
                                }),
                            },
                        }),
                ),
            ],
        })
    }
}

export { VerificationStatePrivateCommand }
