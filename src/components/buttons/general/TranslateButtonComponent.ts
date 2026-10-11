import { ButtonComponent } from "../../base/components/ButtonComponent"
import type { ITranslateButtonComponentOptions } from "@/oliverperzyk/models/components/buttons/general/translate/interfaces/ITranslateButtonComponentOptions"
import { VerificationMessages } from "@/oliverperzyk/globals/messages/verification/VerificationMessages"
import { type BaseMessageOptions, type ButtonInteraction, MessageFlags, TextDisplayBuilder } from "discord.js"

/**
 * @summary Translate button component.
 * @description Handles existing translate buttons with English content while translations are disabled.
 */
class TranslateButtonComponent extends ButtonComponent<ITranslateButtonComponentOptions> {
    /**
     * @summary The custom identifier of the component.
     * @description The custom identifier of the component.
     */
    public readonly customIdentifier: string = "translate"

    /**
     * @summary Resolve message content by identifier.
     * @description Builds English Components V2 content for the given message identifier.
     * @param key - The message identifier from the button custom id.
     * @returns The top-level components to send in the reply.
     */
    public static resolveMessageContent(key: string): NonNullable<BaseMessageOptions["components"]> {
        switch (key) {
            case "verification-message":
                return [VerificationMessages.getVerificationMessage()]
            default:
                return [
                    new TextDisplayBuilder().setContent("Unknown Message"),
                    new TextDisplayBuilder().setContent(
                        "Looks like this message is not supported. Please contact the administrator.",
                    ),
                ]
        }
    }

    /**
     * @summary Handle translate button interaction.
     * @description Sends an ephemeral Components V2 reply with the English message.
     * @param interaction - The button interaction.
     * @param options - Options parsed from the button custom identifier.
     */
    public async onInteract(
        interaction: ButtonInteraction,
        { m: messageIdentifier }: ITranslateButtonComponentOptions,
    ): Promise<void> {
        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
            components: TranslateButtonComponent.resolveMessageContent(messageIdentifier),
        })
    }
}

export { TranslateButtonComponent }
