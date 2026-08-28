import {
    type ChatInputCommandInteraction,
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

/**
 * @summary Event listener for the interaction create event.
 * @description This class is used to register the interaction create event listener.
 */
class InteractionCreateEventListener extends BaseEventListener<Events.InteractionCreate> {
    /**
     * @summary The name of the event.
     * @description The name of the event.
     */
    public readonly eventName: Events.InteractionCreate = Events.InteractionCreate

    /**
     * @summary Handles unknown commands.
     * @description If the command is not found, it will reply with a message indicating that the command is not implemented yet.
     * @param interaction - The interaction that triggered the event.
     * @returns A promise that resolves when the message is sent.
     */
    private static async handleUnknownCommand(interaction: ChatInputCommandInteraction): Promise<void> {
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

    /**
     * @summary Handles unavailable commands.
     * @description If the command is not available, it will reply with a message indicating that the command is not available.
     * @param interaction - The interaction that triggered the event.
     * @returns A promise that resolves when the message is sent.
     */
    private static async handleUnavailableCommand(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [
                new TextDisplayBuilder().setContent("### 🙅 Unavailable Command"),
                new TextDisplayBuilder().setContent("You are not privileged to use this command here, sorry!"),
            ],
            allowedMentions: {},
        })
    }

    /**
     * @summary Handles unimplemented components.
     * @description If the component is not implemented, it will reply with a message indicating that the component is not implemented yet.
     * @param interaction - The interaction that triggered the event.
     * @returns A promise that resolves when the message is sent.
     */
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

    /**
     * @summary Handles all interactions across the application.
     * @description It's in demand to redirect the interaction to the correct component or command.
     */
    public override async onEvent(interaction: Interaction): Promise<void> {
        if (interaction.isChatInputCommand()) {
            const commandInstance: BaseSlashCommand | null = SlashCommandRegistry.findCommand(
                interaction.commandName,
                interaction.guildId,
            )

            if (!commandInstance) return InteractionCreateEventListener.handleUnknownCommand(interaction)
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
