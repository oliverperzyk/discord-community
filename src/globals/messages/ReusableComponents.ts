import { ButtonBuilder, ButtonStyle } from "discord.js"
import { ComponentCustomIdentifierHandler } from "@/oliverperzyk/components/base/common/ComponentCustomIdentifierHandler"

/**
 * @summary Reusable components.
 * @description This class is used to create reusable components.
 */
class ReusableComponents {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Create a translate button.
     * @description Retained for future use; English-only messages do not include this button.
     * @param messageId - The ID of the message to translate.
     * @returns The translate button.
     */
    public static translateButton(messageId: string): ButtonBuilder {
        return new ButtonBuilder()
            .setEmoji({ name: "🌐" })
            .setLabel("Translate")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(
                ComponentCustomIdentifierHandler.resolveCustomIdentifier("translate", {
                    m: messageId,
                }),
            )
    }
}

export { ReusableComponents }
