import { type ChatInputCommandInteraction, MessageFlags } from "discord.js"

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
        if (!interaction.channel?.isSendable()) {
            return
        }

        await interaction.channel.send({
            flags: [MessageFlags.IsComponentsV2],
            components: [],
        })
        return
    }
}

export { HandleVerificationMessagePrivateSubcommand }
