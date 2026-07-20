import { DatabaseConstants } from "@/oliverperzyk/globals/databases/base/DatabaseConstants"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { randomBytes } from "crypto"

/**
 * @summary Manager for the database identifier data.
 * @description This class is used to manage the database identifier data type.
 */
class DatabaseIdentifierDataManager {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}
    /**
     * @summary The regex for the database identifier.
     * @description The regex for the database identifier.
     */
    private static readonly DATABASE_IDENTIFIER_REGEX: RegExp = new RegExp(
        `^[0-9a-fA-F]{${DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH}}$`,
    )

    /**
     * @summary Get a random database identifier.
     * @description This method is used to get a random database identifier.
     * @returns Generated database identifier.
     * @remarks This does not check if a certain table & column is already using this identifier. You have to check this yourself.
     */
    public static get randomDatabaseIdentifier(): DatabaseIdentifier {
        return randomBytes(Math.ceil(DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH / 2))
            .toString("hex")
            .slice(0, DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH) as DatabaseIdentifier
    }

    /**
     * @summary Check if a value is a database identifier.
     * @description This method is used to check if a value is a database identifier.
     * @param value - The value to check.
     * @returns Whether the value is a database identifier, as a type guard.
     */
    public static isDatabaseIdentifier(value: unknown): value is DatabaseIdentifier {
        return typeof value === "string" && this.DATABASE_IDENTIFIER_REGEX.test(value)
    }
}

export { DatabaseIdentifierDataManager }
