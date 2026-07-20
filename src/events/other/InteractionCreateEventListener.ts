import {
    type CommandInteraction,
    Events,
    type Interaction,
    MessageFlags,
    PermissionsBitField,
    TextDisplayBuilder,
} from "discord.js"
import { BaseEventListener } from "../base/BaseEventListener"
import type { BaseSlashCommand } from "@/oliverperzyk/commands/base/BaseSlashCommand"
import { SlashCommandRegistry } from "@/oliverperzyk/commands/base/SlashCommandRegistry"

class InteractionCreateEventListener extends BaseEventListener<Events.InteractionCreate> {
    public readonly eventName: Events.InteractionCreate = Events.InteractionCreate

    private static async handleBadgeCommand(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [
                new TextDisplayBuilder().setContent("### 🎖️ Badge Command"),
                new TextDisplayBuilder().setContent(
                    "This command is only used for me (@oliverperzyk) to have a badge on my profile. Sorry for interrupting your day!",
                ),
            ],
            allowedMentions: {},
        })
    }

    private static async handleUnknownCommand(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [
                new TextDisplayBuilder().setContent("### 🐞 Unknown Command"),
                new TextDisplayBuilder().setContent(
                    "Looks like, this command is not implemented yet. Let the developer (@oliverperzyk) know about it.",
                ),
            ],
            allowedMentions: {},
        })
    }

    private static async handleUnavailableCommand(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [
                new TextDisplayBuilder().setContent("### 🙅 Unavailable Command"),
                new TextDisplayBuilder().setContent("You are not privileged to use this command here, sorry!"),
            ],
            allowedMentions: {},
        })
    }

    public override async onEvent(interaction: Interaction): Promise<void> {
        if (interaction.isCommand()) {
            const commandName: string = interaction.commandName
            if (commandName === "badge") return InteractionCreateEventListener.handleBadgeCommand(interaction)
            const commandInstance: BaseSlashCommand | null = SlashCommandRegistry.getCommandByName(commandName)
            if (!commandInstance) return InteractionCreateEventListener.handleUnknownCommand(interaction)
            // to-do: refactor this part to make server division system actually work
            if (commandInstance.serverType === "BOTH")
                return InteractionCreateEventListener.handleUnavailableCommand(interaction)
            if (
                !(interaction.member?.permissions instanceof PermissionsBitField) ||
                !interaction.member.permissions.has(commandInstance.requiredPermissions)
            )
                return InteractionCreateEventListener.handleUnavailableCommand(interaction)

            await commandInstance.onExecute(interaction)
            return
        }
    }
}

export { InteractionCreateEventListener }
