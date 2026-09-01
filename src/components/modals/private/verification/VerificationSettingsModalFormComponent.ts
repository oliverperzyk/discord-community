import { ModalFormComponent } from "@/oliverperzyk/components/base/components/ModalFormComponent"
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import { DiscordSnowflakeDataManager } from "@/oliverperzyk/globals/managers/data/base/DiscordSnowflakeDataManager"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import type { IVerificationState } from "@/oliverperzyk/models/services/databases/verification/state/interfaces/IVerificationState"
import { VerificationStateService } from "@/oliverperzyk/services/databases/verification/VerificationStateService"
import { MessageFlags, type ModalSubmitInteraction, type Snowflake, TextDisplayBuilder } from "discord.js"

/**
 * @summary Verification settings modal form component.
 * @description This component is used to handle the verification settings modal form.
 */
class VerificationSettingsModalFormComponent extends ModalFormComponent {
    /**
     * @summary The custom identifier of the component.
     * @description The custom identifier of the component.
     */
    public readonly customIdentifier: string = "verificationSettings"

    /**
     * @summary The function to execute when the component is invoked.
     * @description The function to execute when the component is invoked.
     * @param interaction - The interaction that triggered the component.
     */
    public async onInteract(interaction: ModalSubmitInteraction): Promise<void> {
        const language: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
        if (!DiscordSnowflakeDataManager.isDiscordSnowflake(interaction.guildId)) {
            await interaction.reply({
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
                components: [
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({
                            key: "errors.invalid-guild-id",
                            language,
                        }),
                    ),
                ],
            })
            return
        }

        const enabled: boolean = interaction.fields.getCheckbox("state")
        const selectedRoleId: Snowflake | undefined = interaction.fields.getSelectedRoles("role")?.first()?.id
        if (!DiscordSnowflakeDataManager.isDiscordSnowflake(selectedRoleId)) {
            await interaction.reply({
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
                components: [
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({
                            key: "errors.invalid-role-id",
                            language,
                        }),
                    ),
                ],
            })
            return
        }

        const verificationState: IVerificationState | null =
            await VerificationStateService.getVerificationStateByGuildId(interaction.guildId)
        if (verificationState?.roleId === selectedRoleId && verificationState.enabled === enabled) {
            await interaction.reply({
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
                components: [
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({
                            key: "modal.verification.settings.no-changes",
                            language,
                        }),
                    ),
                ],
            })
            return
        }

        await VerificationStateService.updateVerificationStateByGuildId(interaction.guildId, {
            enabled,
            roleId: selectedRoleId,
        })
        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
            components: [
                new TextDisplayBuilder().setContent(
                    TranslationsManager.translate({
                        key: "modal.verification.settings.success",
                        language,
                    }),
                ),
            ],
        })
        return
    }
}

export { VerificationSettingsModalFormComponent }
