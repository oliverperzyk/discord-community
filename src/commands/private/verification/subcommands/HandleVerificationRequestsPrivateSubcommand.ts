import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { VerificationMessages } from "@/oliverperzyk/globals/messages/verification/VerificationMessages"
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { ContainerBuilder, type ChatInputCommandInteraction, MessageFlags } from "discord.js"

/**
 * @summary Handle verification requests private subcommand.
 * @description This class is used to handle the verification requests private subcommand.
 */
class HandleVerificationRequestsPrivateSubcommand {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Execute the subcommand.
     * @description Execute the subcommand that allows to manage the verification requests.
     * @param interaction - The interaction.
     */
    public static async onExecute(interaction: ChatInputCommandInteraction): Promise<void> {
        const language: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
        const message: ContainerBuilder = await VerificationMessages.getVerificationRequestsMessage(language, 1)
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [message],
        })
    }
}

export { HandleVerificationRequestsPrivateSubcommand }
