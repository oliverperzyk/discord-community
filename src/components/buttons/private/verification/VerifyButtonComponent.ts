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
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { ComponentCustomIdentifierHandler } from "../../../base/common/ComponentCustomIdentifierHandler"
import type { IVerificationRequest } from "@/oliverperzyk/models/services/databases/verification/requests/interfaces/IVerificationRequest"
import { VerificationRequestsService } from "@/oliverperzyk/services/databases/verification/VerificationRequestsService"

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
        const language: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
        const guildId: string | null = interaction.guildId
        if (
            !DiscordSnowflakeDataManager.isDiscordSnowflake(guildId) ||
            !DiscordSnowflakeDataManager.isDiscordSnowflake(interaction.user.id)
        ) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
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

        const verificationRequest: IVerificationRequest | null =
            await VerificationRequestsService.getVerificationRequestByUserAndGuild(interaction.user.id, guildId)
        if (verificationRequest !== null) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({ key: "errors.verification.already-requested", language }),
                    ),
                ],
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
                .setTitle(
                    TranslationsManager.translate({
                        key: "modal.verification.title",
                        language,
                    }),
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({
                            key: "modal.verification.description",
                            language,
                        }),
                    ),
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(
                            TranslationsManager.translate({
                                key: "modal.verification.calculation.title",
                                language,
                            }),
                        )
                        .setDescription(
                            TranslationsManager.translate({
                                key: "modal.verification.calculation.description",
                                language,
                                data: {
                                    firstNumber,
                                    secondNumber,
                                },
                            }),
                        )
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId("calculation-result")
                                .setMinLength(1)
                                .setMaxLength(2)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder(
                                    TranslationsManager.translate({
                                        key: "modal.verification.calculation.placeholder",
                                        language,
                                    }),
                                ),
                        ),
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(
                            TranslationsManager.translate({
                                key: "modal.verification.reason.title",
                                language,
                            }),
                        )
                        .setDescription(
                            TranslationsManager.translate({
                                key: "modal.verification.reason.description",
                                language,
                                data: {
                                    firstNumber,
                                    secondNumber,
                                },
                            }),
                        )
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId("reason")
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                                .setPlaceholder(
                                    TranslationsManager.translate({
                                        key: "modal.verification.reason.placeholder",
                                        language,
                                    }),
                                ),
                        ),
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(
                            TranslationsManager.translate({
                                key: "modal.verification.accept-verification.title",
                                language,
                            }),
                        )
                        .setDescription(
                            TranslationsManager.translate({
                                key: "modal.verification.accept-verification.description",
                                language,
                            }),
                        )
                        .setCheckboxComponent(
                            new CheckboxBuilder().setCustomId("accept-verification").setDefault(false),
                        ),
                ),
        )
    }
}

export { VerifyButtonComponent }
