import { ModalFormComponent } from "@/oliverperzyk/components/base/components/ModalFormComponent"
import { DiscordSnowflakeDataManager } from "@/oliverperzyk/globals/managers/data/base/DiscordSnowflakeDataManager"
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
        if (!DiscordSnowflakeDataManager.isDiscordSnowflake(interaction.guildId)) {
            await interaction.reply({
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
                components: [
                    new TextDisplayBuilder().setContent(
                        "Looks like you're not in a guild. Please use this command in a guild.",
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
                components: [new TextDisplayBuilder().setContent("Invalid role. Please select a valid role.")],
            })
            return
        }

        const verificationState: IVerificationState | null =
            await VerificationStateService.getVerificationStateByGuildId(interaction.guildId)
        if (verificationState?.roleId === selectedRoleId && verificationState.enabled === enabled) {
            await interaction.reply({
                flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
                components: [
                    new TextDisplayBuilder().setContent("No changes have been made to the verification settings."),
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
            components: [new TextDisplayBuilder().setContent("Verification settings have been successfully updated.")],
        })
        return
    }
}

export { VerificationSettingsModalFormComponent }
