/**
 * @summary Error class for configuration file errors.
 * @description This class is used to create errors for configuration file errors.
 */
class ConfigurationFileError extends Error {
    /**
     * @summary The path to the configuration file.
     * @description The path to the configuration file.
     */
    public readonly filePath: string

    /**
     * @summary Constructor.
     * @description Creates a new instance of an error related to a configuration file.
     * @param message - The message of the error.
     * @param filePath - The path to the configuration file.
     */
    public constructor(message: string, filePath: string) {
        super(message)
        this.filePath = filePath
        this.name = "ConfigurationFileError"
        Object.setPrototypeOf(this, ConfigurationFileError.prototype)
    }

    /**
     * @summary Create an error for a missing configuration file.
     * @description Creates a new instance of an error related to a missing configuration file.
     * @param filePath - The path to the configuration file.
     * @returns The ConfigurationFileError instance.
     */
    public static fromMissingFile(filePath: string): ConfigurationFileError {
        return new this(`Configuration file ${filePath} is missing.`, filePath)
    }

    /**
     * @summary Create an error for an unsupported file extension.
     * @description Creates a new instance of an error related to an unsupported file extension.
     * @param filePath - The path to the configuration file.
     * @returns The ConfigurationFileError instance.
     */
    public static fromUnsupportedFileExtension(filePath: string): ConfigurationFileError {
        return new this(`Configuration file ${filePath} has an unsupported file extension.`, filePath)
    }

    /**
     * @summary Create an error for an invalid configuration file.
     * @description Creates a new instance of an error related to an invalid configuration file.
     * @param filePath - The path to the configuration file.
     * @returns The ConfigurationFileError instance.
     */
    public static fromInvalidFile(filePath: string): ConfigurationFileError {
        return new this(`Configuration file ${filePath} is invalid.`, filePath)
    }
}

export { ConfigurationFileError }
