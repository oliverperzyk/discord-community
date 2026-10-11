import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { ConfigurationManager } from "@/oliverperzyk/globals/managers/ConfigurationManager"
import { describe, expect, test, beforeAll } from "bun:test"
import { existsSync, lstatSync, readdirSync } from "fs"
import { dirname, extname, join, relative } from "path"
import { cwd } from "process"

/**
 * @summary Verify JSON translations.
 * @description This test verifies if all JSON translations are valid & they do exist.
 */
describe("Verify JSON translations", async (): Promise<void> => {
    const defaultLanguage: Language = Language.ENGLISH
    let allKeys: Set<string>

    /**
     * @summary Resolve the JSON translations directory for a language.
     * @description This function resolves the path to the JSON translations directory for a language.
     * @param language - The language to resolve the directory for.
     * @returns The path to the JSON translations directory.
     */
    const resolveLanguageDirectory = (language: Language): string => {
        return join(
            cwd(),
            "public",
            "translations",
            "contents",
            LanguageDataManager.resolveLocaleCode(language),
            "json",
        )
    }

    /**
     * @summary Load merged translation keys for a language.
     * @description Validates each feature file's schema reference and rejects duplicate keys across files.
     * @param language - The language to validate.
     * @returns The combined set of translation keys.
     */
    const loadLanguageKeys = (language: Language): Set<string> => {
        const directory: string = resolveLanguageDirectory(language)
        expect(existsSync(directory)).toBeTrue()
        expect(lstatSync(directory).isDirectory()).toBeTrue()
        const keys: Set<string> = new Set<string>()
        const files: string[] = readdirSync(directory, { recursive: true, encoding: "utf8" })
            .filter(
                (file: string): boolean =>
                    [".json", ".jsonc"].includes(extname(file)) && lstatSync(join(directory, file)).isFile(),
            )
            .sort()

        for (const file of files) {
            const filePath: string = join(directory, file)
            const jsonTranslations: Record<string, unknown> = ConfigurationManager.getConfiguration(
                relative(join(cwd(), "public"), filePath),
            )
            expect(jsonTranslations).toBeObject()
            expect(Array.isArray(jsonTranslations)).toBeFalse()
            expect(jsonTranslations).toHaveProperty("$schema")
            const schemaPath: string = relative(
                dirname(filePath),
                join(cwd(), "public", "translations", "Translations.schemas.jsonc"),
            ).replaceAll("\\", "/")
            expect(jsonTranslations.$schema).toBe(schemaPath)
            for (const key of Object.keys(jsonTranslations)) {
                if (key === "$schema") continue
                expect(keys.has(key)).toBeFalse()
                keys.add(key)
            }
        }
        return keys
    }

    /**
     * @summary Load all keys from the default language.
     * @description This function loads all keys from the default language.
     */
    beforeAll((): void => {
        allKeys = loadLanguageKeys(defaultLanguage)
    })

    for (const language of LanguageDataManager.VALUES_IN_ARRAY) {
        if (language === defaultLanguage) continue
        /**
         * @summary Check if JSON translations for the language are valid & they do exist.
         * @description This test checks if JSON translations for the language are valid & they do exist. It also checks if all keys from the default language are present in the new language.
         */
        test(`check if JSON translations for ${language} are valid & they do exist`, (): void => {
            expect([...loadLanguageKeys(language)].sort()).toEqual([...allKeys].sort())
        })
    }
})
