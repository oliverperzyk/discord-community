import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import { DiscordSnowflakeDataManager } from "@/oliverperzyk/globals/managers/data/base/DiscordSnowflakeDataManager"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { IVerificationState } from "@/oliverperzyk/models/services/databases/verification/state/interfaces/IVerificationState"
import { VerificationStateService } from "@/oliverperzyk/services/databases/verification/VerificationStateService"
import {
    type ChatInputCommandInteraction,
    ModalBuilder,
    LabelBuilder,
    TextDisplayBuilder,
    CheckboxBuilder,
    RoleSelectMenuBuilder,
} from "discord.js"

/**
 * @summary Handle verification settings private subcommand.
 * @description This class is used to handle the verification settings private subcommand.
 */
class HandleVerificationSettingsPrivateSubcommand {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Construct the modal.
     * @description Construct the modal that allows to manage the verification settings.
     * @param language - The language of the interaction.
     * @returns The modal.
     */
    private static constructModal(language: Language, verificationState: IVerificationState | null): ModalBuilder {
        return new ModalBuilder()
            .setCustomId("verificationSettings")
            .setTitle(
                TranslationsManager.translate({
                    key: "modal.verification.settings.title",
                    language,
                }),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    TranslationsManager.translate({
                        key: verificationState
                            ? "modal.verification.settings.not-configured"
                            : "modal.verification.settings.configure",
                        language,
                    }),
                ),
            )
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel(
                        TranslationsManager.translate({
                            key: "modal.verification.settings.toggle-verification.label",
                            language,
                        }),
                    )
                    .setDescription(
                        TranslationsManager.translate({
                            key: "modal.verification.settings.toggle-verification.description",
                            language,
                        }),
                    )
                    .setCheckboxComponent(
                        new CheckboxBuilder().setCustomId("state").setDefault(verificationState?.enabled ?? false),
                    ),
                new LabelBuilder()
                    .setLabel(
                        TranslationsManager.translate({
                            key: "modal.verification.settings.role.label",
                            language,
                        }),
                    )
                    .setDescription(
                        TranslationsManager.translate({
                            key: "modal.verification.settings.role.description",
                            language,
                        }),
                    )
                    .setRoleSelectMenuComponent(
                        new RoleSelectMenuBuilder()
                            .setCustomId("role")
                            .setPlaceholder(
                                TranslationsManager.translate({
                                    key: "modal.verification.settings.role.placeholder",
                                    language,
                                }),
                            )
                            .setDefaultRoles(verificationState?.roleId ? [verificationState.roleId] : [])
                            .setMinValues(1)
                            .setMaxValues(1),
                    ),
            )
    }

    /**
     * @summary Execute the subcommand.
     * @description Handles the verification settings private subcommand, by simply sending the modal.
     * @param interaction - The interaction.
     */
    public static async onExecute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!DiscordSnowflakeDataManager.isDiscordSnowflake(interaction.guildId)) {
            await interaction.reply({
                content: TranslationsManager.translate({
                    key: "errors.invalid-guild-id",
                    language: await LanguageDataManager.resolveLanguageByInteraction(interaction),
                }),
                ephemeral: true,
            })
            return
        }

        const language: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
        const verificationState: IVerificationState | null =
            await VerificationStateService.getVerificationStateByGuildId(interaction.guildId)
        await interaction.showModal(this.constructModal(language, verificationState))
    }
}

export { HandleVerificationSettingsPrivateSubcommand }
