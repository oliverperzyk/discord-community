import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { describe, expect, test, beforeAll } from "bun:test"

/**
 * @summary Verify JSON translations.
 * @description This test verifies if all JSON translations are valid & they do exist.
 */
describe("Verify JSON translations", async (): Promise<void> => {
    const defaultLanguage: Language = Language.ENGLISH
    const allKeys: Set<string> = new Set<string>()

    /**
     * @summary Load all keys from the default language.
     * @description This function loads all keys from the default language.
     */
    beforeAll(async (): Promise<void> => {
        const jsonTranslations: Record<string, unknown> = await import(
            `../../public/translations/contents/${defaultLanguage.toLowerCase()}.jsonc`
        )
        expect(jsonTranslations).toBeObject()
        expect(jsonTranslations).toHaveProperty("$schema")
        expect(jsonTranslations.$schema).toBe(`../Translations.schemas.jsonc`)
        for (const key of Object.keys(jsonTranslations)) {
            if (key === "$schema") continue
            allKeys.add(key)
        }
    })

    for (const language of LanguageDataManager.VALUES_IN_ARRAY) {
        if (language === defaultLanguage) continue
        /**
         * @summary Check if JSON translations for the language are valid & they do exist.
         * @description This test checks if JSON translations for the language are valid & they do exist. It also checks if all keys from the default language are present in the new language.
         */
        test(`check if JSON translations for ${language} are valid & they do exist`, async (): Promise<void> => {
            const jsonTranslations: Record<string, unknown> = await import(
                `@/public/translations/contents/${language.toLowerCase()}.jsonc`
            )
            expect(jsonTranslations).toBeObject()
            expect(jsonTranslations).toHaveProperty("$schema")
            expect(jsonTranslations.$schema).toBe(`../Translations.schemas.jsonc`)
            for (const key of Object.keys(jsonTranslations)) {
                if (key === "$schema") continue
                expect(allKeys.has(key)).toBeTrue()
            }
        })
    }
})
