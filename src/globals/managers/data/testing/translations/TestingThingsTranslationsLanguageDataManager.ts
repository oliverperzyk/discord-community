import { TestingThingsTranslationsLanguage } from "@/oliverperzyk/models/services/databases/testing/translations/enums/TestingThingsTranslationsLanguage"

/**
 * @summary The data manager for the testing things translations language.
 * @description This class is used to manage the data for the testing things translations language.
 */
class TestingThingsTranslationsLanguageDataManager {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The values of the testing things translations language.
     * @description The values of the testing things translations language.
     */
    private static readonly VALUES: ReadonlySet<TestingThingsTranslationsLanguage> =
        new Set<TestingThingsTranslationsLanguage>([
            TestingThingsTranslationsLanguage.POLISH,
            TestingThingsTranslationsLanguage.ENGLISH,
        ])

    /**
     * @summary The values of the testing things translations language in an array.
     * @description The values of the testing things translations language in an array, used for schema definitions.
     */
    public static readonly VALUES_IN_ARRAY: readonly TestingThingsTranslationsLanguage[] = Array.from(this.VALUES)

    /**
     * @summary Checks if a value is a valid testing things translations language.
     * @description Checks if a value is a valid testing things translations language.
     * @param value - The value to check.
     * @returns Boolean whether the value is a valid testing things translations language, returned as a type guard.
     */
    public static isTestingThingsTranslationsLanguage(value: string): value is TestingThingsTranslationsLanguage {
        return this.VALUES.has(value as TestingThingsTranslationsLanguage)
    }

    /**
     * @summary Resolves the language.
     * @description Resolves the language, if the language is not valid, it will return the default language.
     * @param language - The language to resolve.
     * @returns The resolved language.
     */
    public static resolveLanguage(language: string): TestingThingsTranslationsLanguage {
        language = language.toLowerCase().trim()
        if (this.isTestingThingsTranslationsLanguage(language)) return language
        return TestingThingsTranslationsLanguage.ENGLISH
    }
}

export { TestingThingsTranslationsLanguageDataManager }
