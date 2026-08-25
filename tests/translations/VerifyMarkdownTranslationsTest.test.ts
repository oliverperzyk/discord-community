import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { describe, expect, test, beforeAll } from "bun:test"
import { existsSync, readdirSync, statSync } from "fs"
import { join } from "path"
import { cwd } from "process"

/**
 * @summary Verify Markdown translations.
 * @description This test verifies if all Markdown translations exist for every language.
 */
describe("Verify Markdown translations", async (): Promise<void> => {
    const defaultLanguage: Language = Language.ENGLISH
    const allFiles: Set<string> = new Set<string>()

    /**
     * @summary Resolve the Markdown translations directory for a language.
     * @description This function resolves the path to the Markdown translations directory for a language.
     * @param language - The language to resolve the directory for.
     * @returns The path to the Markdown translations directory.
     */
    const resolveLanguageDirectory = (language: Language): string => {
        return join(cwd(), "public", "translations", "contents", LanguageDataManager.resolveLocaleCode(language))
    }

    /**
     * @summary Load all Markdown files from the default language.
     * @description This function loads all Markdown files from the default language directory.
     */
    beforeAll((): void => {
        const defaultDirectory: string = resolveLanguageDirectory(defaultLanguage)
        expect(existsSync(defaultDirectory)).toBe(true)
        expect(statSync(defaultDirectory).isDirectory()).toBe(true)

        const files: string[] = readdirSync(defaultDirectory, { recursive: true, encoding: "utf8" })
        for (const file of files) {
            const normalizedFile: string = file.replaceAll("\\", "/")
            if (!normalizedFile.endsWith(".md")) continue
            if (!statSync(join(defaultDirectory, normalizedFile)).isFile()) continue
            allFiles.add(normalizedFile)
        }
    })

    for (const language of LanguageDataManager.VALUES_IN_ARRAY) {
        /**
         * @summary Check if Markdown translations for the language exist.
         * @description This test checks if the language has a Markdown translations directory. For languages other than the default, it also checks if all files from the default language are present.
         */
        test(`check if Markdown translations for ${language} exist`, (): void => {
            const languageDirectory: string = resolveLanguageDirectory(language)
            expect(existsSync(languageDirectory)).toBe(true)
            expect(statSync(languageDirectory).isDirectory()).toBe(true)
            if (language === defaultLanguage) return
            for (const file of allFiles) {
                const filePath: string = join(languageDirectory, file)
                expect(existsSync(filePath)).toBe(true)
                expect(statSync(filePath).isFile()).toBe(true)
            }
        })
    }
})
