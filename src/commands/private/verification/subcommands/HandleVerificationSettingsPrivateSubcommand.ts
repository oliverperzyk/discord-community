import { DiscordSnowflakeDataManager } from "@/oliverperzyk/globals/managers/data/base/DiscordSnowflakeDataManager"
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
     * @returns The modal.
     */
    private static constructModal(verificationState: IVerificationState | null): ModalBuilder {
        return new ModalBuilder()
            .setCustomId("verificationSettings")
            .setTitle("Verification Settings")
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    verificationState
                        ? "Verification settings have not been configured for this guild yet, by default verification is disabled, but you can change it below."
                        : "Below you can configure the verification settings for this guild.",
                ),
            )
            .addLabelComponents(
                new LabelBuilder()
                    .setLabel("Toggle Verification")
                    .setDescription("Whether the verification is enabled or disabled.")
                    .setCheckboxComponent(
                        new CheckboxBuilder().setCustomId("state").setDefault(verificationState?.enabled ?? false),
                    ),
                new LabelBuilder()
                    .setLabel("Verification Role")
                    .setDescription("The role that will be assigned to the users who pass the verification.")
                    .setRoleSelectMenuComponent(
                        new RoleSelectMenuBuilder()
                            .setCustomId("role")
                            .setPlaceholder(
                                "Select the role that will be assigned to the users who pass the verification.",
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
                content: "Looks like you're not in a guild. Please use this command in a guild.",
                ephemeral: true,
            })
            return
        }

        const verificationState: IVerificationState | null =
            await VerificationStateService.getVerificationStateByGuildId(interaction.guildId)
        await interaction.showModal(this.constructModal(verificationState))
    }
}

export { HandleVerificationSettingsPrivateSubcommand }
