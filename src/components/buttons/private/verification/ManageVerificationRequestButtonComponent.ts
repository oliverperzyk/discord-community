import { ComponentCustomIdentifierHandler } from "@/oliverperzyk/components/base/common/ComponentCustomIdentifierHandler"
import { ButtonComponent } from "@/oliverperzyk/components/base/components/ButtonComponent"
import { DatabaseConstants } from "@/oliverperzyk/globals/databases/base/DatabaseConstants"
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import type { IManageVerificationRequestButtonComponentOptions } from "@/oliverperzyk/models/components/buttons/private/verification/requests/interfaces/IManageVerificationRequestButtonComponentOptions"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
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
        const language: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
        const verificationRequest: IVerificationRequest | null =
            await VerificationRequestsService.getVerificationRequestById(id)
        if (!verificationRequest) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({ key: "errors.verification.request-not-found", language }),
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
                .setTitle(
                    TranslationsManager.translate({
                        key: "modal.manage-verification.title",
                        language,
                    }),
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({
                            key: "modal.manage-verification.content",
                            language,
                            data: {
                                user: verificationRequest.userId,
                                timestamp: Math.floor(verificationRequest.createdAt.getTime() / 1000),
                            },
                        }),
                    ),
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(
                            TranslationsManager.translate({
                                key: "modal.manage-verification.action.title",
                                language,
                            }),
                        )
                        .setDescription(
                            TranslationsManager.translate({
                                key: "modal.manage-verification.action.description",
                                language,
                            }),
                        )
                        .setStringSelectMenuComponent(
                            new StringSelectMenuBuilder()
                                .setCustomId("action")
                                .setMaxValues(1)
                                .setRequired(true)
                                .setPlaceholder(
                                    TranslationsManager.translate({
                                        key: "modal.manage-verification.action.placeholder",
                                        language,
                                    }),
                                )
                                .setOptions(
                                    new StringSelectMenuOptionBuilder()
                                        .setEmoji({
                                            name: "✅",
                                        })
                                        .setLabel(
                                            TranslationsManager.translate({
                                                key: "modal.manage-verification.action.accept",
                                                language,
                                            }),
                                        )
                                        .setDescription(
                                            TranslationsManager.translate({
                                                key: "modal.manage-verification.action.accept.description",
                                                language,
                                            }),
                                        )
                                        .setDefault(true)
                                        .setValue("accept"),
                                    new StringSelectMenuOptionBuilder()
                                        .setEmoji({
                                            name: "❌",
                                        })
                                        .setLabel(
                                            TranslationsManager.translate({
                                                key: "modal.manage-verification.action.reject",
                                                language,
                                            }),
                                        )
                                        .setDescription(
                                            TranslationsManager.translate({
                                                key: "modal.manage-verification.action.reject.description",
                                                language,
                                            }),
                                        )
                                        .setValue("reject"),
                                ),
                        ),
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(
                            TranslationsManager.translate({
                                key: "modal.manage-verification.comment.title",
                                language,
                            }),
                        )
                        .setDescription(
                            TranslationsManager.translate({
                                key: "modal.manage-verification.comment.description",
                                language,
                            }),
                        )
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId("comment")
                                .setRequired(false)
                                .setStyle(TextInputStyle.Paragraph)
                                .setMaxLength(DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH)
                                .setPlaceholder(
                                    TranslationsManager.translate({
                                        key: "modal.manage-verification.comment.placeholder",
                                        language,
                                    }),
                                ),
                        ),
                ),
        )
    }
}

export { ManageVerificationRequestButtonComponent }
