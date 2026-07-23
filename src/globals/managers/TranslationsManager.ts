import { ConfigurationManager } from "@/oliverperzyk/globals/managers/ConfigurationManager"
import { TranslationError } from "@/oliverperzyk/models/builders/process-errors/TranslationError"
import { TranslationArgumentDataType } from "@/oliverperzyk/models/globals/translations/enums/TranslationArgumentDataType"
import { TranslationKeyType } from "@/oliverperzyk/models/globals/translations/enums/TranslationKeyType"
import { TranslationPluralForm } from "@/oliverperzyk/models/globals/translations/enums/TranslationPluralForm"
import type { ITranslateOptions } from "@/oliverperzyk/models/globals/translations/interfaces/ITranslateOptions"
import type { ITranslationParameterKey } from "@/oliverperzyk/models/globals/translations/interfaces/ITranslationParameterKey"
import type { ITranslationsLocale } from "@/oliverperzyk/models/globals/translations/interfaces/ITranslationsLocale"
import type { LanguageCode } from "@/oliverperzyk/models/globals/translations/types/LanguageCode"
import type { TranslationArgumentValue } from "@/oliverperzyk/models/globals/translations/types/TranslationArgumentValue"
import type { TranslationKey } from "@/oliverperzyk/models/globals/translations/types/TranslationKey"

/**
 * @summary Manager for locale translations.
 * @description Loads locale files from public/translations and resolves BASIC/PARAMETER keys.
 */
class TranslationsManager {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Supported language codes.
     * @description Language codes that have corresponding locale files.
     */
    private static readonly SUPPORTED_LANGUAGE_CODES: ReadonlySet<string> = new Set<string>(["en", "pl"])

    /**
     * @summary Default language code.
     * @description Fallback language used when the requested code is unsupported.
     */
    private static readonly DEFAULT_LANGUAGE_CODE: LanguageCode = "en" as LanguageCode

    /**
     * @summary Placeholder pattern.
     * @description Matches `{{ argument_name }}` placeholders inside PARAMETER texts.
     */
    private static readonly PLACEHOLDER_PATTERN: RegExp = /\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g

    /**
     * @summary Loaded locale cache.
     * @description Caches parsed locale files keyed by language code.
     */
    private static readonly localeCache: Map<LanguageCode, ITranslationsLocale> = new Map<
        LanguageCode,
        ITranslationsLocale
    >()

    /**
     * @summary Narrow a raw language tag to a supported language code.
     * @description Normalizes BCP-47 tags to a base language code, falling back to English.
     * @param rawCode - The raw language tag to narrow.
     * @returns A supported language code.
     */
    public static narrowToLanguageCode(rawCode: string): LanguageCode {
        const parsedCode: string = rawCode.toLowerCase().trim().split("-")[0] ?? ""
        if (this.SUPPORTED_LANGUAGE_CODES.has(parsedCode)) return parsedCode as LanguageCode
        return this.DEFAULT_LANGUAGE_CODE
    }

    /**
     * @summary Translate a key.
     * @description Resolves a BASIC or PARAMETER translation for the requested language.
     * @param options - The translation options.
     * @returns The rendered translation text.
     */
    public static translate(options: ITranslateOptions): string {
        const language: LanguageCode = this.narrowToLanguageCode(options.language)
        const entry: TranslationKey = this.getTranslationEntry(options.key, language)

        if (entry.type === TranslationKeyType.BASIC) return entry.text
        return this.renderParameterTranslation(options.key, language, entry, options.data)
    }

    /**
     * @summary Get a locale file.
     * @description Loads and caches the locale file for a language code.
     * @param language - The language code to load.
     * @returns The locale file contents.
     */
    private static getLocale(language: LanguageCode): ITranslationsLocale {
        const cachedLocale: ITranslationsLocale | undefined = this.localeCache.get(language)
        if (cachedLocale) return cachedLocale

        const locale: ITranslationsLocale = ConfigurationManager.getConfiguration<ITranslationsLocale>(
            `translations/contents/${language}.jsonc`,
        )
        this.localeCache.set(language, locale)
        return locale
    }

    /**
     * @summary Get a translation entry.
     * @description Looks up a flat translation key inside a locale file.
     * @param key - The translation key to resolve.
     * @param language - The language code to search in.
     * @returns The translation entry.
     */
    private static getTranslationEntry(key: string, language: LanguageCode): TranslationKey {
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
        language: LanguageCode,
        entry: ITranslationParameterKey,
        data: ITranslateOptions["data"],
    ): string {
        const values: Readonly<Record<string, TranslationArgumentValue>> = data ?? {}
        this.validateArguments(key, entry, values)

        const pluralForm: TranslationPluralForm = this.resolvePluralForm(language, entry, values)
        const template: string = entry.texts[pluralForm]
        return template.replace(this.PLACEHOLDER_PATTERN, (_match: string, argumentName: string): string => {
            const value: TranslationArgumentValue | undefined = values[argumentName]
            if (value === undefined) throw TranslationError.fromMissingArgument(key, argumentName)
            return String(value)
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
        language: LanguageCode,
        entry: ITranslationParameterKey,
        values: Readonly<Record<string, TranslationArgumentValue>>,
    ): TranslationPluralForm {
        const count: number | undefined = this.findCountArgument(entry, values)
        if (count === undefined) return TranslationPluralForm.ONE
        if (count === 0) return TranslationPluralForm.ZERO

        const category: Intl.LDMLPluralRule = new Intl.PluralRules(language).select(count)
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
