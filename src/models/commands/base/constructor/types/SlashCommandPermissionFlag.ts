import { PermissionsBitField } from "discord.js"

/**
 * @summary Types of slash command permission flag.
 * @description Used to determine the permission flag of the slash command.
 */
type SlashCommandPermissionFlag = (typeof PermissionsBitField.Flags)[keyof typeof PermissionsBitField.Flags]

export type { SlashCommandPermissionFlag }
