import { ButtonComponent } from "../../base/components/ButtonComponent"
import type { ITranslateButtonComponentOptions } from "@/oliverperzyk/models/components/buttons/general/translate/interfaces/ITranslateButtonComponentOptions"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { VerificationMessages } from "@/oliverperzyk/globals/messages/verification/VerificationMessages"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { type BaseMessageOptions, type ButtonInteraction, MessageFlags, TextDisplayBuilder } from "discord.js"
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"

/**
 * @summary Translate button component.
 * @description Replies with an ephemeral translation of a known message identifier.
 */
class TranslateButtonComponent extends ButtonComponent<ITranslateButtonComponentOptions> {
    /**
     * @summary The custom identifier of the component.
     * @description The custom identifier of the component.
     */
    public readonly customIdentifier: string = "translate"

    /**
     * @summary Resolve message content by identifier.
     * @description Builds Components V2 content for the given message key and language.
     * @param key - The message identifier from the button custom id.
     * @param language - The language to render the message in.
     * @returns The top-level components to send in the reply.
     */
    public static resolveMessageContent(
        key: string,
        language: Language,
    ): NonNullable<BaseMessageOptions["components"]> {
        switch (key) {
            case "verification-message":
                return [VerificationMessages.getVerificationMessage(language)]
            default:
                return [
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({
                            key: "errors.unknown-message.title",
                            language,
                        }),
                    ),
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({
                            key: "errors.unknown-message.description",
                            language,
                        }),
                    ),
                ]
        }
    }

    /**
     * @summary Handle translate button interaction.
     * @description Sends an ephemeral Components V2 reply with the resolved translation.
     * @param interaction - The button interaction.
     * @param options - Options parsed from the button custom identifier.
     */
    public async onInteract(
        interaction: ButtonInteraction,
        { m: messageIdentifier }: ITranslateButtonComponentOptions,
    ): Promise<void> {
        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
            components: TranslateButtonComponent.resolveMessageContent(
                messageIdentifier,
                await LanguageDataManager.resolveLanguageByInteraction(interaction),
            ),
        })
    }
}

export { TranslateButtonComponent }
