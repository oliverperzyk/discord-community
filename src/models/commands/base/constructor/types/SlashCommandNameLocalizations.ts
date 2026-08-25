import type { SlashCommandStructureType } from "./SlashCommandStructureType"

/**
 * @summary The localizations of the slash command name.
 * @description The localizations of the slash command name in all supported languages.
 */
type SlashCommandNameLocalizations = NonNullable<Parameters<SlashCommandStructureType["setNameLocalizations"]>[0]>

export type { SlashCommandNameLocalizations }
