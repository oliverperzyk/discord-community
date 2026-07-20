/**
 * @summary Constants for the database.
 * @description This class is used to store the constants for the database.
 * @remarks This has to be in this location, to not load additional stuff while making a migration.
 */
class DatabaseConstants {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The length of the database identifier column.
     * @description The length of the database identifier column.
     */
    public static readonly DATABASE_IDENTIFIER_COLUMN_LENGTH: number = 64
}

export { DatabaseConstants }
