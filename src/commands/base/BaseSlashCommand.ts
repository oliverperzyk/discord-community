import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import type { SlashCommandServerType } from "@/oliverperzyk/models/commands/base/constructor/enums/SlashCommandServerType"
import type { SlashCommandNameLocalizations } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandNameLocalizations"
import type { SlashCommandPermissionFlag } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandPermissionFlag"
import type { SlashCommandStructureType } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandStructureType"
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { type ChatInputCommandInteraction } from "discord.js"

/**
 * @summary Base class for all slash commands.
 * @description This class is the base class for all slash commands.
 */
abstract class BaseSlashCommand {
    /**
     * @summary The server type of the slash command.
     * @description The type of server(s) on which the command is available.
     */
    public abstract readonly serverType: SlashCommandServerType
    /**
     * @summary The structure of the slash command.
     * @description The structure of the slash command builder.
     */
    public abstract readonly structure: SlashCommandStructureType
    /**
     * @summary The required permissions of the slash command.
     * @description The required permissions of the slash command, in order to execute it.
     */
    public readonly requiredPermissions: readonly SlashCommandPermissionFlag[] = []

    /**
     * @summary The function to execute when the slash command is invoked.
     * @description The function to execute when the slash command is invoked. It should be overridden by the subclass.
     * @param interaction - The interaction that triggered the command.
     * @returns The result of the command execution.
     */
    public abstract onExecute(interaction: ChatInputCommandInteraction): unknown

    /**
     * @summary Generates the default English translation for the slash command.
     * @description Resolves the English fallback used by Discord's required name and description fields.
     * @param key - The key of the translation.
     * @returns The English translation text.
     */
    public static generateCommandTranslation(key: string): string {
        return TranslationsManager.translate({
            key,
            language: Language.ENGLISH,
        })
    }

    /**
     * @summary Generates the translations for the slash command.
     * @description Generates the translations for the slash command's name or description in all supported languages.
     * @param key - The key of the translation.
     * @returns The name translations.
     */
    public static generateCommandsTranslations(key: string): SlashCommandNameLocalizations {
        const localizations: SlashCommandNameLocalizations = {}

        for (const language of LanguageDataManager.VALUES_IN_ARRAY) {
            for (const locale of LanguageDataManager.resolveDiscordLocales(language)) {
                localizations[locale] = TranslationsManager.translate({
                    key,
                    language,
                })
            }
        }

        return localizations
    }
}

export { BaseSlashCommand }
