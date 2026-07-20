import type {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from "discord.js"

/**
 * @summary Types of slash command structure.
 * @description Used to determine the structure of the slash command builders.
 */
type SlashCommandStructureType =
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandGroupBuilder

export type { SlashCommandStructureType }
