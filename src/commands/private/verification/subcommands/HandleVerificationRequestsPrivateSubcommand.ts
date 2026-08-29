import { type ChatInputCommandInteraction } from "discord.js"

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
    public static async onExecute(_interaction: ChatInputCommandInteraction): Promise<void> {
        return
    }
}

export { HandleVerificationRequestsPrivateSubcommand }
