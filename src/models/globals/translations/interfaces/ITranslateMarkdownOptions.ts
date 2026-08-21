import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import type { TranslationArgumentValue } from "../types/TranslationArgumentValue"

/**
 * @summary Options for translating a Markdown file.
 * @description Describes which Markdown file to resolve, in which language, and with which argument data.
 */
interface ITranslateMarkdownOptions {
    /**
     * @summary The Markdown file to resolve.
     * @description Path relative to the locale Markdown directory, without the `.md` extension.
     */
    readonly file: string
    /**
     * @summary The language to translate into.
     */
    readonly language: Language | string
    /**
     * @summary Optional argument values for placeholders and PARAMETER keys.
     */
    readonly data?: Readonly<Record<string, TranslationArgumentValue>>
}

export type { ITranslateMarkdownOptions }
