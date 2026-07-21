import {
    type CommandInteraction,
    Events,
    type Interaction,
    MessageFlags,
    PermissionsBitField,
    TextDisplayBuilder,
    type MessageComponentInteraction,
    type ModalSubmitInteraction,
} from "discord.js"
import { BaseEventListener } from "../base/BaseEventListener"
import type { BaseSlashCommand } from "@/oliverperzyk/commands/base/BaseSlashCommand"
import { SlashCommandRegistry } from "@/oliverperzyk/commands/base/SlashCommandRegistry"
import { ComponentCustomIdentifierHandler } from "@/oliverperzyk/components/base/common/ComponentCustomIdentifierHandler"
import { ButtonComponentRegister } from "@/oliverperzyk/components/base/registries/ButtonComponentRegister"
import type { ButtonComponent } from "@/oliverperzyk/components/base/components/ButtonComponent"
import { ModalFormComponentRegister } from "@/oliverperzyk/components/base/registries/ModalFormComponentRegister"
import type { ModalFormComponent } from "@/oliverperzyk/components/base/components/ModalFormComponent"
import { StringSelectMenuComponentRegister } from "@/oliverperzyk/components/base/registries/StringSelectMenuComponentRegister"
import type { StringSelectMenuComponent } from "@/oliverperzyk/components/base/components/StringSelectMenuComponent"
import { ChannelSelectMenuComponentRegister } from "@/oliverperzyk/components/base/registries/ChannelSelectMenuComponentRegister"
import type { ChannelSelectMenuComponent } from "@/oliverperzyk/components/base/components/ChannelSelectMenuComponent"
import { RoleSelectMenuComponentRegister } from "@/oliverperzyk/components/base/registries/RoleSelectMenuComponentRegister"
import type { RoleSelectMenuComponent } from "@/oliverperzyk/components/base/components/RoleSelectMenuComponent"
import { UserSelectMenuComponentRegister } from "@/oliverperzyk/components/base/registries/UserSelectMenuComponentRegister"
import type { UserSelectMenuComponent } from "@/oliverperzyk/components/base/components/UserSelectMenuComponent"

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

    private static async handleUnimplementedComponent(
        interaction: MessageComponentInteraction | ModalSubmitInteraction,
    ): Promise<void> {
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [
                new TextDisplayBuilder().setContent("### 🐞 Unimplemented Component"),
                new TextDisplayBuilder().setContent(
                    "Looks like, this component is not implemented yet. Let the developer (@oliverperzyk) know about it.",
                ),
            ],
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

        if (interaction.isButton()) {
            const { customIdentifier, options } = ComponentCustomIdentifierHandler.parseCustomIdentifier(
                interaction.customId,
            )
            const componentInstance: ButtonComponent<unknown> | null =
                ButtonComponentRegister.getComponentByCustomIdentifier(customIdentifier)
            if (!componentInstance) return InteractionCreateEventListener.handleUnimplementedComponent(interaction)
            await componentInstance.onInteract(interaction, options)
            return
        }

        if (interaction.isModalSubmit()) {
            const { customIdentifier, options } = ComponentCustomIdentifierHandler.parseCustomIdentifier(
                interaction.customId,
            )
            const componentInstance: ModalFormComponent<unknown> | null =
                ModalFormComponentRegister.getComponentByCustomIdentifier(customIdentifier)
            if (!componentInstance) return InteractionCreateEventListener.handleUnimplementedComponent(interaction)
            await componentInstance.onInteract(interaction, options)
            return
        }

        if (interaction.isStringSelectMenu()) {
            const { customIdentifier, options } = ComponentCustomIdentifierHandler.parseCustomIdentifier(
                interaction.customId,
            )
            const componentInstance: StringSelectMenuComponent<unknown> | null =
                StringSelectMenuComponentRegister.getComponentByCustomIdentifier(customIdentifier)
            if (!componentInstance) return InteractionCreateEventListener.handleUnimplementedComponent(interaction)
            await componentInstance.onInteract(interaction, options)
            return
        }

        if (interaction.isChannelSelectMenu()) {
            const { customIdentifier, options } = ComponentCustomIdentifierHandler.parseCustomIdentifier(
                interaction.customId,
            )
            const componentInstance: ChannelSelectMenuComponent<unknown> | null =
                ChannelSelectMenuComponentRegister.getComponentByCustomIdentifier(customIdentifier)
            if (!componentInstance) return InteractionCreateEventListener.handleUnimplementedComponent(interaction)
            await componentInstance.onInteract(interaction, options)
            return
        }

        if (interaction.isRoleSelectMenu()) {
            const { customIdentifier, options } = ComponentCustomIdentifierHandler.parseCustomIdentifier(
                interaction.customId,
            )
            const componentInstance: RoleSelectMenuComponent<unknown> | null =
                RoleSelectMenuComponentRegister.getComponentByCustomIdentifier(customIdentifier)
            if (!componentInstance) return InteractionCreateEventListener.handleUnimplementedComponent(interaction)
            await componentInstance.onInteract(interaction, options)
            return
        }

        if (interaction.isUserSelectMenu()) {
            const { customIdentifier, options } = ComponentCustomIdentifierHandler.parseCustomIdentifier(
                interaction.customId,
            )
            const componentInstance: UserSelectMenuComponent<unknown> | null =
                UserSelectMenuComponentRegister.getComponentByCustomIdentifier(customIdentifier)
            if (!componentInstance) return InteractionCreateEventListener.handleUnimplementedComponent(interaction)
            await componentInstance.onInteract(interaction, options)
        }
    }
}

export { InteractionCreateEventListener }
