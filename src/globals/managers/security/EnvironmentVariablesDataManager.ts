import { EnvironmentVariableError } from "@/oliverperzyk/models/builders/process-errors/EnvironmentVariableError"
import { NodeEnvironment } from "@/oliverperzyk/models/globals/environment/enums/NodeEnvironment"
import { env } from "bun"

/**
 * @summary Environment variables data manager class.
 * @description A class that manages the data of the environment variables.
 */
class EnvironmentVariablesDataManager {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Get a string environment variable.
     * @description Get a string environment variable.
     * @param variableName - The name of the environment variable.
     * @param required - Whether the environment variable is required.
     * @returns The value of the environment variable, or undefined if the environment variable is not set and required is false
     * @throws {EnvironmentVariableError} If the environment variable is required and not set.
     */
    public static getString<T extends boolean>(variableName: string, required: T): T extends true ? string : string | undefined {
        const value: string | undefined = env[variableName]
        if (required && !value) {
            throw EnvironmentVariableError.fromMissingVariable(variableName)
        }
        return value as T extends true ? string : string | undefined
    }

    /**
     * @summary Get a number environment variable.
     * @description Get a number environment variable.
     * @param variableName - The name of the environment variable.
     * @param required - Whether the environment variable is required.
     * @returns The value of the environment variable, or undefined if the environment variable is not set and required is false.
     * @throws {EnvironmentVariableError} If the environment variable is required and not set, or if the environment variable is not a valid number.
     */
    public static getNumber<T extends boolean>(variableName: string, required: T): T extends true ? number : number | undefined {
        const value: string | undefined = env[variableName]
        if (value === undefined) {
            if (required) throw EnvironmentVariableError.fromMissingVariable(variableName)
            return undefined as T extends true ? number : number | undefined
        }

        const parsedValue = Number(value)
        if (Number.isNaN(parsedValue)) {
            throw EnvironmentVariableError.fromInvalidNumberVariable(variableName)
        }

        return parsedValue as T extends true ? number : number | undefined
    }

    /**
     * @summary Get a boolean environment variable.
     * @description Get a boolean environment variable.
     * @param variableName - The name of the environment variable.
     * @param required - Whether the environment variable is required.
     * @returns The value of the environment variable, or undefined if the environment variable is not set and required is false.
     * @throws {EnvironmentVariableError} If the environment variable is required and not set, or if the environment variable is not a valid boolean.
     */
    public static getBoolean<T extends boolean>(variableName: string, required: T): T extends true ? boolean : boolean | undefined {
        const value: string | undefined = env[variableName]
        if (value === undefined) {
            if (required) throw EnvironmentVariableError.fromMissingVariable(variableName)
            return undefined as T extends true ? boolean : boolean | undefined
        }
    
        switch (value.toLowerCase().trim()) {
            case "true":
            case "1":
                return true as T extends true ? boolean : boolean | undefined
            case "false":
            case "0":
                return false as T extends true ? boolean : boolean | undefined
            default:
                throw EnvironmentVariableError.fromInvalidBooleanVariable(variableName)
        }
    }

    /**
     * @summary Get a URL environment variable.
     * @description Get a URL environment variable.
     * @param variableName - The name of the environment variable.
     * @param required - Whether the environment variable is required.
     * @returns The value of the environment variable, or undefined if the environment variable is not set and required is false.
     * @throws {EnvironmentVariableError} If the environment variable is required and not set, or if the environment variable is not a valid URL.
     */
    public static getURL<T extends boolean>(variableName: string, required: T): T extends true ? URL : URL | undefined {
        const value: string | undefined = env[variableName]
        if (value === undefined) {
            if (required) throw EnvironmentVariableError.fromMissingVariable(variableName)
            return undefined as T extends true ? URL : URL | undefined
        }
        
        try {
            return new URL(value) as T extends true ? URL : URL | undefined
        } catch (error) {
            throw EnvironmentVariableError.fromInvalidURLVariable(variableName)
        }
    }

    /**
     * @summary Get a port environment variable.
     * @description Get a port environment variable.
     * @param variableName - The name of the environment variable.
     * @param required - Whether the environment variable is required.
     * @returns The value of the environment variable, or undefined if the environment variable is not set and required is false.
     * @throws {EnvironmentVariableError} If the environment variable is required and not set, or if the environment variable is not a valid port.
     */
    public static getPort<T extends boolean>(variableName: string, required: T): T extends true ? number : number | undefined {
        const value: string | undefined = env[variableName]
        if (value === undefined) {
            if (required) throw EnvironmentVariableError.fromMissingVariable(variableName)
            return undefined as T extends true ? number : number | undefined
        }
        
        const parsedValue = Number(value)
        if (Number.isNaN(parsedValue)) {
            throw EnvironmentVariableError.fromInvalidNumberVariable(variableName)
        }

        if (parsedValue < 0 || parsedValue > 65535) {
            throw EnvironmentVariableError.fromInvalidPortVariable(variableName)
        }

        return parsedValue as T extends true ? number : number | undefined
    }

    /**
     * @summary Get the Node.js environment.
     * @description Get the Node.js environment.
     * @returns The Node.js environment.
     * @throws {EnvironmentVariableError} If the NODE_ENV environment variable is not set, or if the environment variable is not a valid environment.
     */
    public static getNodeEnvironment(): NodeEnvironment {
        const value: string | undefined = env["NODE_ENV"]
        if (value === undefined) {
            throw EnvironmentVariableError.fromMissingVariable("NODE_ENV")
        }

        switch (value.toLowerCase().trim()) {
            case NodeEnvironment.DEVELOPMENT:
                return NodeEnvironment.DEVELOPMENT
            case NodeEnvironment.PRODUCTION:
                return NodeEnvironment.PRODUCTION
            case NodeEnvironment.TEST:
                return NodeEnvironment.TEST
            default:
                throw EnvironmentVariableError.fromInvalidNodeEnvironmentVariable("NODE_ENV")
        }
    }
}

export { EnvironmentVariablesDataManager }
