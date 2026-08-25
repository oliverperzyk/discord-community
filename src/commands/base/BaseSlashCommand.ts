import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import type { SlashCommandServerType } from "@/oliverperzyk/models/commands/base/constructor/enums/SlashCommandServerType"
import type { SlashCommandPermissionFlag } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandPermissionFlag"
import type { SlashCommandStructureType } from "@/oliverperzyk/models/commands/base/constructor/types/SlashCommandStructureType"
import { type CommandInteraction, type SlashCommandBuilder } from "discord.js"

type SlashCommandNameLocalizations = NonNullable<Parameters<SlashCommandBuilder["setNameLocalizations"]>[0]>

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
    public abstract onExecute(interaction: CommandInteraction): unknown

    /**
     * @summary Generates the name translations for the slash command.
     * @description Generates the name translations for the slash command in all supported languages.
     * @param key - The key of the translation.
     * @returns The name translations.
     */
    public static generateCommandsNameTranslations(key: string): SlashCommandNameLocalizations {
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
