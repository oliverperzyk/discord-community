import { env } from "bun"

/**
 * @summary Environment variable error class.
 * @description A class that represents an error related to an environment variable.
 */
class EnvironmentVariableError extends Error {
    /**
     * @summary The name of the environment variable that caused the error.
     */
    public readonly variableName: string

    /**
     * @summary Constructor.
     * @description Constructor for the EnvironmentVariableError class.
     * @param message - The message of the error.
     * @param variableName - The name of the environment variable that caused the error.
     */
    public constructor(message: string, variableName: string) {
        super(message)
        this.variableName = variableName
    }


    /**
     * @summary Getter for the value of the environment variable that caused the error.
     */
    public get variableValue(): string | undefined {
        return env[this.variableName]
    }

    /**
     * @summary Create an error from a missing variable.
     * @description Create an error from a missing variable.
     * @param variableName - The name of the environment variable that is missing.
     * @returns A new EnvironmentVariableError instance.
     */
    public static fromMissingVariable(variableName: string): EnvironmentVariableError {
        return new this(`Environment variable ${variableName} is required.`, variableName)
    }

    /**
     * @summary Create an error from an invalid port variable.
     * @description Create an error from an invalid port variable.
     * @param variableName - The name of the environment variable that is invalid.
     * @returns A new EnvironmentVariableError instance.
     */
    public static fromInvalidPortVariable(variableName: string): EnvironmentVariableError {
        return new this(`Environment variable ${variableName} is not a valid port.`, variableName)
    }

    /**
     * @summary Create an error from an invalid URL variable.
     * @description Create an error from an invalid URL variable.
     * @param variableName - The name of the environment variable that is invalid.
     * @returns A new EnvironmentVariableError instance.
     */
    public static fromInvalidURLVariable(variableName: string): EnvironmentVariableError {
        return new this(`Environment variable ${variableName} is not a valid URL.`, variableName)
    }

    /**
     * @summary Create an error from an invalid boolean variable.
     * @description Create an error from an invalid boolean variable.
     * @param variableName - The name of the environment variable that is invalid.
     * @returns A new EnvironmentVariableError instance.
     */
    public static fromInvalidBooleanVariable(variableName: string): EnvironmentVariableError {
        return new this(`Environment variable ${variableName} is not a valid boolean.`, variableName)
    }

    /**
     * @summary Create an error from an invalid number variable.
     * @description Create an error from an invalid number variable.
     * @param variableName - The name of the environment variable that is invalid.
     * @returns A new EnvironmentVariableError instance.
     */
    public static fromInvalidNumberVariable(variableName: string): EnvironmentVariableError {
        return new this(`Environment variable ${variableName} is not a valid number.`, variableName)
    }

    /**
     * @summary Create an error from an invalid environment variable.
     * @description Create an error from an invalid environment variable. ("DEVELOPMENT", "PRODUCTION", "TEST")
     * @param variableName - The name of the environment variable that is invalid.
     * @returns A new EnvironmentVariableError instance.
     */
    public static fromInvalidNodeEnvironmentVariable(variableName: string): EnvironmentVariableError {
        return new this(`Environment variable ${variableName} is not a valid environment variable. ("DEVELOPMENT", "PRODUCTION", "TEST")`, variableName)
    }
}

export { EnvironmentVariableError }
