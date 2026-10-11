import { SlashCommandServerType } from "@/oliverperzyk/models/commands/base/constructor/enums/SlashCommandServerType"
import { BaseSlashCommand } from "../../base/BaseSlashCommand"
import type { SlashCommandStructureType } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandStructureType"
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
} from "discord.js"
import { HandleVerificationSettingsPrivateSubcommand } from "./subcommands/HandleVerificationSettingsPrivateSubcommand"
import { HandleVerificationMessagePrivateSubcommand } from "./subcommands/HandleVerificationMessagePrivateSubcommand"
import { HandleVerificationRequestsPrivateSubcommand } from "./subcommands/HandleVerificationRequestsPrivateSubcommand"
import { SlashCommandPermissionFlag } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandPermissionFlag"

/**
 * @summary General verification private command.
 * @description This command is used to manage the verification system in the current guild.
 * @remarks As because this command has subcommands, different classes are used to manage each subcommand.
 */
class GeneralVerificationPrivateCommand extends BaseSlashCommand {
    /**
     * @summary The server type of the command.
     * @description The server type of the command.
     */
    public override readonly serverType: SlashCommandServerType = SlashCommandServerType.PRIVATE

    /**
     * @summary The structure of the command.
     * @description The structure of the command.
     */
    public override readonly structure: SlashCommandStructureType = new SlashCommandBuilder()
        .setName("verification")
        .setDescription("Allows to manage the verification system in the current guild.")
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName("settings")
                .setDescription("Allows to manage the verification settings in the current guild."),
        )
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName("requests")
                .setDescription("Allows to manage the verification requests in the current guild."),
        )
        .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
            subcommand.setName("message").setDescription("Sends the verification message in the current channel."),
        )

    /**
     * @summary The required permissions for the command.
     * @description The required permissions for the command.
     */
    public override readonly requiredPermissions: readonly SlashCommandPermissionFlag[] = [
        PermissionFlagsBits.Administrator,
    ]

    /**
     * @summary Execute the command.
     * @description Redirect the execution to the appropriate subcommand.
     * @param interaction - The interaction.
     */
    public async onExecute(interaction: ChatInputCommandInteraction): Promise<void> {
        const subcommand = interaction.options.getSubcommand(true)

        switch (subcommand) {
            case "settings":
                await HandleVerificationSettingsPrivateSubcommand.onExecute(interaction)
                break
            case "requests":
                await HandleVerificationRequestsPrivateSubcommand.onExecute(interaction)
                break
            case "message":
                await HandleVerificationMessagePrivateSubcommand.onExecute(interaction)
                break
        }

        return
    }
}

export { GeneralVerificationPrivateCommand }
