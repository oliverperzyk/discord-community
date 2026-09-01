import { ButtonBuilder, ButtonStyle } from "discord.js"
import { TranslationsManager } from "../managers/TranslationsManager"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
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
     * @description Creates a translate button for a given message.
     * @param language - The language to translate the button to.
     * @param messageId - The ID of the message to translate.
     * @returns The translate button.
     */
    public static translateButton(language: Language, messageId: string): ButtonBuilder {
        return new ButtonBuilder()
            .setEmoji({ name: "🌐" })
            .setLabel(
                TranslationsManager.translate({
                    key: "verification.interaction.translate",
                    language,
                }),
            )
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(
                ComponentCustomIdentifierHandler.resolveCustomIdentifier("translate", {
                    m: messageId,
                }),
            )
    }
}

export { ReusableComponents }
