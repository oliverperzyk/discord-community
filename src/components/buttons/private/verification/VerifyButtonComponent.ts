import {
    type ButtonInteraction,
    LabelBuilder,
    MessageFlags,
    ModalBuilder,
    TextDisplayBuilder,
    TextInputBuilder,
    TextInputStyle,
    CheckboxBuilder,
} from "discord.js"
import { ButtonComponent } from "../../../base/components/ButtonComponent"
import { DiscordSnowflakeDataManager } from "@/oliverperzyk/globals/managers/data/base/DiscordSnowflakeDataManager"
import { ComponentCustomIdentifierHandler } from "../../../base/common/ComponentCustomIdentifierHandler"
import type { IVerificationRequest } from "@/oliverperzyk/models/services/databases/verification/requests/interfaces/IVerificationRequest"
import { VerificationRequestsService } from "@/oliverperzyk/services/databases/verification/VerificationRequestsService"
import { DatabaseConstants } from "@/oliverperzyk/globals/databases/base/DatabaseConstants"

/**
 * @summary The verify button component.
 * @description This component is used to send a modal for verification.
 */
class VerifyButtonComponent extends ButtonComponent<undefined> {
    /**
     * @summary The custom identifier of the button.
     * @description The custom identifier of the button.
     */
    public readonly customIdentifier: string = "verify"

    /**
     * @summary The function to be called when the button is interacted with.
     * @description This function is used to send a modal for verification.
     * @param interaction - The interaction that triggered the button.
     */
    public async onInteract(interaction: ButtonInteraction): Promise<void> {
        const guildId: string | null = interaction.guildId
        if (
            !DiscordSnowflakeDataManager.isDiscordSnowflake(guildId) ||
            !DiscordSnowflakeDataManager.isDiscordSnowflake(interaction.user.id)
        ) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        "Looks like you're not in a guild. Please use this command in a guild.",
                    ),
                ],
            })
            return
        }

        const verificationRequest: IVerificationRequest | null =
            await VerificationRequestsService.getVerificationRequestByUserAndGuild(interaction.user.id, guildId)
        if (verificationRequest !== null) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [new TextDisplayBuilder().setContent("You cannot request verification again.")],
            })
            return
        }

        const [firstNumber, secondNumber]: number[] = new Array(2)
            .fill(0)
            .map((): number => 1 + Math.floor(Math.random() * 10))
        await interaction.showModal(
            new ModalBuilder()
                .setCustomId(
                    ComponentCustomIdentifierHandler.resolveCustomIdentifier("verification", {
                        result: firstNumber + secondNumber,
                    }),
                )
                .setTitle("Verification")
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        "Please fill out the verification form to verify yourself on this server.",
                    ),
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel("Calculate the result.")
                        .setDescription(`How much is ${firstNumber} + ${secondNumber}?`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId("calculation-result")
                                .setMinLength(1)
                                .setMaxLength(2)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder("Enter the result."),
                        ),
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel("Why do you want to join this server?")
                        .setDescription("Describe yourself and tell why, you should be added to this server.")
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId("reason")
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                                .setMaxLength(DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH)
                                .setPlaceholder("Tell a little about yourself..."),
                        ),
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel("Accept guidelines and conditions")
                        .setDescription(
                            "To become a member of this server, you need to accept the guidelines and conditions of the server.",
                        )
                        .setCheckboxComponent(
                            new CheckboxBuilder().setCustomId("accept-verification").setDefault(false),
                        ),
                ),
        )
    }
}

export { VerifyButtonComponent }
