/**
 * @summary Error class for translation errors.
 * @description This class is used to create errors related to translation resolution.
 */
class TranslationError extends Error {
    /**
     * @summary The translation key that caused the error.
     */
    public readonly key: string

    /**
     * @summary Constructor.
     * @description Creates a new instance of an error related to translations.
     * @param message - The message of the error.
     * @param key - The translation key that caused the error.
     */
    public constructor(message: string, key: string) {
        super(message)
        this.key = key
        this.name = "TranslationError"
        Object.setPrototypeOf(this, TranslationError.prototype)
    }

    /**
     * @summary Create an error for a missing translation key.
     * @description Creates a new instance of an error related to a missing translation key.
     * @param key - The missing translation key.
     * @param language - The language that was requested.
     * @returns The TranslationError instance.
     */
    public static fromMissingKey(key: string, language: string): TranslationError {
        return new this(`Translation key "${key}" is missing for language "${language}".`, key)
    }

    /**
     * @summary Create an error for a missing translation argument.
     * @description Creates a new instance of an error related to a missing argument.
     * @param key - The translation key that requires the argument.
     * @param argumentName - The missing argument name.
     * @returns The TranslationError instance.
     */
    public static fromMissingArgument(key: string, argumentName: string): TranslationError {
        return new this(`Translation key "${key}" is missing argument "${argumentName}".`, key)
    }

    /**
     * @summary Create an error for an invalid translation argument.
     * @description Creates a new instance of an error related to an invalid argument value.
     * @param key - The translation key that received the invalid argument.
     * @param argumentName - The invalid argument name.
     * @param expectedType - The expected argument type.
     * @returns The TranslationError instance.
     */
    public static fromInvalidArgument(key: string, argumentName: string, expectedType: string): TranslationError {
        return new this(
            `Translation key "${key}" received an invalid value for argument "${argumentName}". Expected ${expectedType}.`,
            key,
        )
    }

    /**
     * @summary Create an error for an invalid Markdown translation file.
     * @description Creates a new instance of an error related to an invalid Markdown file path.
     * @param file - The invalid Markdown file path.
     * @returns The TranslationError instance.
     */
    public static fromInvalidMarkdownFile(file: string): TranslationError {
        return new this(`Translation markdown file "${file}" is invalid.`, file)
    }
}

export { TranslationError }
