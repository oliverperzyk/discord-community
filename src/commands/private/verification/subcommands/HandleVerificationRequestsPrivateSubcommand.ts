import { VerificationMessages } from "@/oliverperzyk/globals/messages/verification/VerificationMessages"
import { type ChatInputCommandInteraction, MessageFlags } from "discord.js"

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
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [await VerificationMessages.getVerificationRequestsMessage(1)],
        })
    }
}

export { HandleVerificationRequestsPrivateSubcommand }
