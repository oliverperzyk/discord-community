import { VerificationMessages } from "@/oliverperzyk/globals/messages/verification/VerificationMessages"
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
        if (!interaction.channel?.isSendable()) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        "Invalid channel. Please use a text channel to send the verification message.",
                    ),
                ],
            })
            return
        }

        await interaction.channel.send({
            flags: [MessageFlags.IsComponentsV2],
            components: [VerificationMessages.getVerificationMessage()],
        })
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [
                new TextDisplayBuilder().setContent("The verification message has been sent in this channel."),
            ],
        })
        return
    }
}

export { HandleVerificationMessagePrivateSubcommand }
