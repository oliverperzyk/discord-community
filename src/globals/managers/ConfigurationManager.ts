import { ConfigurationFileError } from "@/oliverperzyk/models/builders/process-errors/ConfigurationFileError"
import { YAML } from "bun"
import { existsSync, readFileSync } from "fs"
import { extname } from "path"

/**
 * @summary Manager for configuration files.
 * @description This manager is used to manage configuration files.
 */
class ConfigurationManager {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Parse a YAML file.
     * @description Parses a YAML file and returns the parsed content.
     * @param filePath - The path to the YAML file.
     * @param fileContent - The content of the YAML file.
     * @returns The parsed content.
     */
    private static parseYamlFile<T>(filePath: string, fileContent: string): T {
        try {
            return YAML.parse(fileContent) as T
        } catch {
            throw ConfigurationFileError.fromInvalidFile(filePath)
        }
    }

    /**
     * @summary Parse a JSON file.
     * @description Parses a JSON file and returns the parsed content.
     * @param filePath - The path to the JSON file.
     * @param fileContent - The content of the JSON file.
     * @returns The parsed content.
     */
    private static parseJsonFile<T>(filePath: string, fileContent: string): T {
        try {
            return JSON.parse(fileContent)
        } catch {
            throw ConfigurationFileError.fromInvalidFile(filePath)
        }
    }

    /**
     * @summary Get a configuration from a file.
     * @description Gets a configuration from a file and returns the parsed content.
     * @param filePath - The path to the configuration file.
     * @returns The parsed content.
     */
    public static getConfiguration<T>(filePath: string): T {
        if (!existsSync(filePath)) throw ConfigurationFileError.fromMissingFile(filePath)

        const fileContent: string = readFileSync(filePath, "utf8")
        switch (extname(filePath)) {
            case ".yaml":
            case ".yml":
                return ConfigurationManager.parseYamlFile<T>(filePath, fileContent)
            case ".json":
                return ConfigurationManager.parseJsonFile<T>(filePath, fileContent)
            default:
                throw ConfigurationFileError.fromUnsupportedFileExtension(filePath)
        }
    }
}

export { ConfigurationManager }
