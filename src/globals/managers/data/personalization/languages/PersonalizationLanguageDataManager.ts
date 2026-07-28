import { PersonalizationLanguage } from "@/oliverperzyk/models/services/databases/personalization/languages/enums/PersonalizationLanguage"

/**
 * @summary The data manager for the personalization language.
 * @description This class is used to manage the data for the personalization language.
 */
class PersonalizationLanguageDataManager {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The values of the personalization language.
     * @description The values of the personalization language.
     */
    private static readonly VALUES: ReadonlySet<PersonalizationLanguage> = new Set<PersonalizationLanguage>([
        PersonalizationLanguage.POLISH,
        PersonalizationLanguage.ENGLISH,
    ])

    /**
     * @summary The values of the personalization language in an array.
     * @description The values of the personalization language in an array, used for schema definitions.
     */
    public static readonly VALUES_IN_ARRAY: readonly PersonalizationLanguage[] = Array.from(this.VALUES)

    /**
     * @summary Checks if a value is a valid personalization language.
     * @description Checks if a value is a valid personalization language.
     * @param value - The value to check.
     * @returns Boolean whether the value is a valid personalization language, returned as a type guard.
     */
    public static isPersonalizationLanguage(value: string): value is PersonalizationLanguage {
        return this.VALUES.has(value as PersonalizationLanguage)
    }
}

export { PersonalizationLanguageDataManager }
