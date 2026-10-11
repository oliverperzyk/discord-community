import { ComponentCustomIdentifierHandler } from "@/oliverperzyk/components/base/common/ComponentCustomIdentifierHandler"
import { ButtonComponent } from "@/oliverperzyk/components/base/components/ButtonComponent"
import { DatabaseConstants } from "@/oliverperzyk/globals/databases/base/DatabaseConstants"
import type { IManageVerificationRequestButtonComponentOptions } from "@/oliverperzyk/models/components/buttons/private/verification/requests/interfaces/IManageVerificationRequestButtonComponentOptions"
import type { IVerificationRequest } from "@/oliverperzyk/models/services/databases/verification/requests/interfaces/IVerificationRequest"
import { VerificationRequestsService } from "@/oliverperzyk/services/databases/verification/VerificationRequestsService"
import {
    MessageFlags,
    type ButtonInteraction,
    TextDisplayBuilder,
    ModalBuilder,
    LabelBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextInputStyle,
    TextInputBuilder,
} from "discord.js"

/**
 * @summary The manage verification request button component.
 * @description This component is used to manage a verification request.
 */
class ManageVerificationRequestButtonComponent extends ButtonComponent<IManageVerificationRequestButtonComponentOptions> {
    /**
     * @summary The custom identifier of the button.
     * @description The custom identifier of the button.
     */
    public readonly customIdentifier: string = "manage-verification"

    /**
     * @summary The function to be called when the button is interacted with.
     * @description This function is used to handle the interaction with the button.
     * @param interaction - The interaction that triggered the button.
     * @param options - The options parsed from the custom identifier.
     */
    public async onInteract(
        interaction: ButtonInteraction,
        { id }: Readonly<IManageVerificationRequestButtonComponentOptions>,
    ): Promise<void> {
        const verificationRequest: IVerificationRequest | null =
            await VerificationRequestsService.getVerificationRequestById(id)
        if (!verificationRequest) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        "Looks like this verification request does not exist in our database. Sorry.",
                    ),
                ],
            })
            return
        }

        await interaction.showModal(
            new ModalBuilder()
                .setCustomId(
                    ComponentCustomIdentifierHandler.resolveCustomIdentifier("manage-verification", {
                        id,
                    }),
                )
                .setTitle("Manage Verification Request")
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        `Verification request for <@${verificationRequest.userId}> has been requested on <t:${Math.floor(verificationRequest.createdAt.getTime() / 1000)}:R>.`,
                    ),
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel("User's Statement")
                        .setDescription(
                            verificationRequest.comment ??
                                "> + User did not fill out the verification form, so there are no arguments to show.",
                        )
                        .setStringSelectMenuComponent(
                            new StringSelectMenuBuilder()
                                .setCustomId("action")
                                .setMaxValues(1)
                                .setRequired(true)
                                .setPlaceholder("Select the action to perform on the verification request.")
                                .setOptions(
                                    new StringSelectMenuOptionBuilder()
                                        .setEmoji({
                                            name: "✅",
                                        })
                                        .setLabel("Accept")
                                        .setDescription("Accept the verification request.")
                                        .setDefault(true)
                                        .setValue("accept"),
                                    new StringSelectMenuOptionBuilder()
                                        .setEmoji({
                                            name: "❌",
                                        })
                                        .setLabel("Reject")
                                        .setDescription("Reject the verification request.")
                                        .setValue("reject"),
                                ),
                        ),
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel("Comment")
                        .setDescription("The comment to add to the verification request.")
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId("comment")
                                .setRequired(false)
                                .setStyle(TextInputStyle.Paragraph)
                                .setMaxLength(DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH)
                                .setPlaceholder("Enter the comment to add to the verification request."),
                        ),
                ),
        )
    }
}

export { ManageVerificationRequestButtonComponent }
