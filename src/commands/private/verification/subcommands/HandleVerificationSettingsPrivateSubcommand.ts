import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { type ChatInputCommandInteraction, ModalBuilder } from "discord.js"

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
     * @param language - The language of the interaction.
     * @returns The modal.
     */
    private static constructModal(_language: Language): ModalBuilder {
        return new ModalBuilder()
    }

    /**
     * @summary Execute the subcommand.
     * @description Execute the subcommand.
     * @param interaction - The interaction.
     */
    public static async onExecute(interaction: ChatInputCommandInteraction): Promise<void> {
        const language: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
        await interaction.showModal(this.constructModal(language))
    }
}

export { HandleVerificationSettingsPrivateSubcommand }
