import { ConfigurationManager } from "@/oliverperzyk/globals/managers/ConfigurationManager"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { TranslationError } from "@/oliverperzyk/models/builders/process-errors/TranslationError"
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { TranslationArgumentDataType } from "@/oliverperzyk/models/globals/translations/enums/TranslationArgumentDataType"
import { TranslationKeyType } from "@/oliverperzyk/models/globals/translations/enums/TranslationKeyType"
import { TranslationPluralForm } from "@/oliverperzyk/models/globals/translations/enums/TranslationPluralForm"
import type { ITranslateMarkdownOptions } from "@/oliverperzyk/models/globals/translations/interfaces/ITranslateMarkdownOptions"
import type { ITranslateOptions } from "@/oliverperzyk/models/globals/translations/interfaces/ITranslateOptions"
import type { ITranslationParameterKey } from "@/oliverperzyk/models/globals/translations/interfaces/ITranslationParameterKey"
import type { ITranslationsLocale } from "@/oliverperzyk/models/globals/translations/interfaces/ITranslationsLocale"
import type { TranslationArgumentValue } from "@/oliverperzyk/models/globals/translations/types/TranslationArgumentValue"
import type { TranslationKey } from "@/oliverperzyk/models/globals/translations/types/TranslationKey"

/**
 * @summary Manager for locale translations.
 * @description Loads locale JSONC and Markdown files from public/translations and resolves BASIC/PARAMETER keys.
 */
class TranslationsManager {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Placeholder pattern source.
     * @description Matches `{{ argument_name }}` placeholders inside PARAMETER texts and Markdown files.
     */
    private static readonly PLACEHOLDER_PATTERN_SOURCE: string = String.raw`\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}`

    /**
     * @summary Loaded locale cache.
     * @description Caches parsed locale files keyed by language.
     */
    private static readonly localeCache: Map<Language, ITranslationsLocale> = new Map<Language, ITranslationsLocale>()

    /**
     * @summary Loaded Markdown cache.
     * @description Caches raw Markdown files keyed by language and relative file path.
     */
    private static readonly markdownCache: Map<string, string> = new Map<string, string>()

    /**
     * @summary Translate a key.
     * @description Resolves a BASIC or PARAMETER translation for the requested language.
     * @param options - The translation options.
     * @returns The rendered translation text.
     */
    public static translate(options: ITranslateOptions): string {
        const language: Language = LanguageDataManager.resolveLanguage(options.language)
        const entry: TranslationKey = this.getTranslationEntry(options.key, language)

        if (entry.type === TranslationKeyType.BASIC) return entry.text
        return this.renderParameterTranslation(options.key, language, entry, options.data)
    }

    /**
     * @summary Translate a Markdown file.
     * @description Loads a locale Markdown file and replaces `{{ key }}` placeholders like JSON entries.
     * @param options - The Markdown translation options.
     * @returns The rendered Markdown content.
     */
    public static translateMarkdown(options: ITranslateMarkdownOptions): string {
        const language: Language = LanguageDataManager.resolveLanguage(options.language)
        const content: string = this.getMarkdown(options.file, language)
        return this.interpolateMarkdown(options.file, language, content, options.data)
    }

    /**
     * @summary Get a locale file.
     * @description Loads and caches the locale file for a language.
     * @param language - The language to load.
     * @returns The locale file contents.
     */
    private static getLocale(language: Language): ITranslationsLocale {
        const cachedLocale: ITranslationsLocale | undefined = this.localeCache.get(language)
        if (cachedLocale) return cachedLocale

        const locale: ITranslationsLocale = ConfigurationManager.getConfiguration<ITranslationsLocale>(
            `translations/contents/${LanguageDataManager.resolveLocaleCode(language)}.jsonc`,
        )
        this.localeCache.set(language, locale)
        return locale
    }

    /**
     * @summary Get a Markdown translation file.
     * @description Loads and caches the Markdown file for a language.
     * @param file - The Markdown file to load.
     * @param language - The language to load.
     * @returns The Markdown file contents.
     */
    private static getMarkdown(file: string, language: Language): string {
        const relativeFilePath: string = this.resolveMarkdownFilePath(file, language)
        const cachedMarkdown: string | undefined = this.markdownCache.get(relativeFilePath)
        if (cachedMarkdown !== undefined) return cachedMarkdown

        const markdown: string = ConfigurationManager.getConfiguration<string>(relativeFilePath)
        this.markdownCache.set(relativeFilePath, markdown)
        return markdown
    }

    /**
     * @summary Resolve a Markdown translation file path.
     * @description Builds a `public/translations/contents/{locale}/{file}.md` path and rejects traversal.
     * @param file - The Markdown file requested by the caller.
     * @param language - The language used to select the locale directory.
     * @returns The path relative to `public/`.
     */
    private static resolveMarkdownFilePath(file: string, language: Language): string {
        const normalizedFile: string = file.trim().replaceAll("\\", "/").replace(/\.md$/i, "")
        if (
            normalizedFile.length === 0 ||
            normalizedFile.includes("..") ||
            normalizedFile.startsWith("/") ||
            normalizedFile.endsWith("/")
        ) {
            throw TranslationError.fromInvalidMarkdownFile(file)
        }

        return `translations/contents/${LanguageDataManager.resolveLocaleCode(language)}/${normalizedFile}.md`
    }

    /**
     * @summary Interpolate placeholders in Markdown.
     * @description Resolves translation keys like JSON entries, then fills remaining placeholders from `data`.
     * @param file - The Markdown file being rendered.
     * @param language - The language used to resolve nested translation keys.
     * @param content - The raw Markdown content.
     * @param data - Optional argument values.
     * @returns The interpolated Markdown content.
     */
    private static interpolateMarkdown(
        file: string,
        language: Language,
        content: string,
        data: ITranslateMarkdownOptions["data"],
    ): string {
        const values: Readonly<Record<string, TranslationArgumentValue>> = data ?? {}
        return content.replace(this.createPlaceholderPattern(), (_match: string, placeholderName: string): string => {
            const locale: ITranslationsLocale = this.getLocale(language)
            const entry: TranslationKey | string | undefined = locale[placeholderName]
            if (entry !== undefined && typeof entry !== "string" && "type" in entry) {
                return this.translate({ key: placeholderName, language, data: values })
            }

            return this.interpolatePlaceholderValue(file, placeholderName, values)
        })
    }

    /**
     * @summary Create a placeholder matcher.
     * @description Returns a fresh global regular expression so nested interpolation cannot share lastIndex.
     * @returns A regular expression that matches translation placeholders.
     */
    private static createPlaceholderPattern(): RegExp {
        return new RegExp(this.PLACEHOLDER_PATTERN_SOURCE, "g")
    }

    /**
     * @summary Interpolate a placeholder value.
     * @description Replaces a `{{ argument_name }}` placeholder with its provided value.
     * @param key - The translation key or Markdown file used in error messages.
     * @param argumentName - The placeholder name to resolve.
     * @param values - The provided argument values.
     * @returns The stringified argument value.
     */
    private static interpolatePlaceholderValue(
        key: string,
        argumentName: string,
        values: Readonly<Record<string, TranslationArgumentValue>>,
    ): string {
        const value: TranslationArgumentValue | undefined = values[argumentName]
        if (value === undefined) throw TranslationError.fromMissingArgument(key, argumentName)
        return String(value)
    }

    /**
     * @summary Get a translation entry.
     * @description Looks up a flat translation key inside a locale file.
     * @param key - The translation key to resolve.
     * @param language - The language to search in.
     * @returns The translation entry.
     */
    private static getTranslationEntry(key: string, language: Language): TranslationKey {
        const locale: ITranslationsLocale = this.getLocale(language)
        const entry: TranslationKey | string | undefined = locale[key]
        if (entry === undefined || typeof entry === "string" || !("type" in entry)) {
            throw TranslationError.fromMissingKey(key, language)
        }

        return entry
    }

    /**
     * @summary Render a PARAMETER translation.
     * @description Selects a plural form, validates arguments, and interpolates placeholders.
     * @param key - The translation key being rendered.
     * @param language - The language used for plural rules.
     * @param entry - The PARAMETER translation entry.
     * @param data - Optional argument values.
     * @returns The rendered translation text.
     */
    private static renderParameterTranslation(
        key: string,
        language: Language,
        entry: ITranslationParameterKey,
        data: ITranslateOptions["data"],
    ): string {
        const values: Readonly<Record<string, TranslationArgumentValue>> = data ?? {}
        this.validateArguments(key, entry, values)

        const pluralForm: TranslationPluralForm = this.resolvePluralForm(language, entry, values)
        const template: string = entry.texts[pluralForm]
        return template.replace(this.createPlaceholderPattern(), (_match: string, argumentName: string): string => {
            return this.interpolatePlaceholderValue(key, argumentName, values)
        })
    }

    /**
     * @summary Validate PARAMETER arguments.
     * @description Ensures all declared arguments exist and match their declared types.
     * @param key - The translation key being validated.
     * @param entry - The PARAMETER translation entry.
     * @param values - The provided argument values.
     */
    private static validateArguments(
        key: string,
        entry: ITranslationParameterKey,
        values: Readonly<Record<string, TranslationArgumentValue>>,
    ): void {
        for (const [argumentName, argument] of Object.entries(entry.arguments)) {
            if (!(argumentName in values)) throw TranslationError.fromMissingArgument(key, argumentName)

            const value: TranslationArgumentValue = values[argumentName]
            if (!this.isValidArgumentValue(argument.type, value)) {
                throw TranslationError.fromInvalidArgument(key, argumentName, argument.type)
            }
        }
    }

    /**
     * @summary Check whether an argument value matches its type.
     * @description Validates STRING, NUMBER, FLOAT, and BOOLEAN argument values.
     * @param type - The expected argument type.
     * @param value - The provided argument value.
     * @returns Whether the value is valid for the type.
     */
    private static isValidArgumentValue(type: TranslationArgumentDataType, value: TranslationArgumentValue): boolean {
        switch (type) {
            case TranslationArgumentDataType.STRING:
                return typeof value === "string"
            case TranslationArgumentDataType.NUMBER:
                return typeof value === "number" && Number.isInteger(value) && Number.isFinite(value)
            case TranslationArgumentDataType.FLOAT:
                return typeof value === "number" && Number.isFinite(value)
            case TranslationArgumentDataType.BOOLEAN:
                return typeof value === "boolean"
            default:
                return false
        }
    }

    /**
     * @summary Resolve the plural form for a PARAMETER translation.
     * @description Uses the first numeric argument with Intl.PluralRules, preferring an explicit zero form.
     * @param language - The language used for plural rules.
     * @param entry - The PARAMETER translation entry.
     * @param values - The provided argument values.
     * @returns The selected plural form.
     */
    private static resolvePluralForm(
        language: Language,
        entry: ITranslationParameterKey,
        values: Readonly<Record<string, TranslationArgumentValue>>,
    ): TranslationPluralForm {
        const count: number | undefined = this.findCountArgument(entry, values)
        if (count === undefined) return TranslationPluralForm.ONE
        if (count === 0) return TranslationPluralForm.ZERO

        const category: Intl.LDMLPluralRule = new Intl.PluralRules(
            LanguageDataManager.resolveLocaleCode(language),
        ).select(count)
        switch (category) {
            case "one":
                return TranslationPluralForm.ONE
            case "few":
                return TranslationPluralForm.FEW
            case "zero":
                return TranslationPluralForm.ZERO
            case "two":
            case "many":
            case "other":
            default:
                return TranslationPluralForm.MANY
        }
    }

    /**
     * @summary Find the count argument for pluralization.
     * @description Returns the first NUMBER or FLOAT argument value declared on the entry.
     * @param entry - The PARAMETER translation entry.
     * @param values - The provided argument values.
     * @returns The count value, or undefined when no numeric argument exists.
     */
    private static findCountArgument(
        entry: ITranslationParameterKey,
        values: Readonly<Record<string, TranslationArgumentValue>>,
    ): number | undefined {
        for (const [argumentName, argument] of Object.entries(entry.arguments)) {
            if (
                argument.type !== TranslationArgumentDataType.NUMBER &&
                argument.type !== TranslationArgumentDataType.FLOAT
            ) {
                continue
            }

            const value: TranslationArgumentValue | undefined = values[argumentName]
            if (typeof value === "number") return value
        }

        return undefined
    }
}

export { TranslationsManager }
