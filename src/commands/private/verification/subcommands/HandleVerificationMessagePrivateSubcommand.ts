import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { VerificationMessages } from "@/oliverperzyk/globals/messages/verification/VerificationMessages"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { type ChatInputCommandInteraction, MessageFlags, TextDisplayBuilder } from "discord.js"

/**
 * @summary Handle verification message private subcommand.
 * @description This class is used to handle the verification message private subcommand.
 */
class HandleVerificationMessagePrivateSubcommand {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Execute the subcommand.
     * @description Execute the subcommand that sends the verification message.
     * @param interaction - The interaction.
     */
    public static async onExecute(interaction: ChatInputCommandInteraction): Promise<void> {
        const language: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
        if (!interaction.channel?.isSendable()) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        TranslationsManager.translate({
                            key: "commands.verification.message.invalid-channel",
                            language,
                        }),
                    ),
                ],
            })
            return
        }

        await interaction.channel.send({
            flags: [MessageFlags.IsComponentsV2],
            components: [VerificationMessages.getVerificationMessage(language)],
        })
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [
                new TextDisplayBuilder().setContent(
                    TranslationsManager.translate({
                        key: "commands.verification.message.success",
                        language,
                    }),
                ),
            ],
        })
        return
    }
}

export { HandleVerificationMessagePrivateSubcommand }
