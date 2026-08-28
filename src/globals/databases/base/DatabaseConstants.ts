import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { timestamp, varchar } from "drizzle-orm/pg-core"

/**
 * @summary Constants for the database.
 * @description This class is used to store the constants for the database.
 * @remarks This has to be in this location, to not load additional stuff while making a migration.
 */
class DatabaseConstants {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The length of the database identifier column.
     * @description The length of the database identifier column.
     */
    public static readonly DATABASE_IDENTIFIER_COLUMN_LENGTH: number = 64

    /**
     * @summary The length of the Discord snowflake column.
     * @description Discord snowflakes are 64-bit integers, so their decimal form is at most 20 characters.
     */
    public static readonly DISCORD_SNOWFLAKE_COLUMN_LENGTH: number = 20

    /**
     * @summary The length of a typical content.
     * @description This includes titles, short summaries, etc.
     */
    public static readonly BASE_CONTENT_COLUMN_LENGTH: number = 255

    /**
     * @summary The columns for the base tables.
     * @description Columns that are common to all tables, returned as a fresh object every single time to prevent reference errors.
     * @returns Columns that are common to all tables.
     */
    public static get BASE_TABLES_COLUMNS() {
        return {
            id: varchar("id", { length: DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH })
                .notNull()
                .primaryKey()
                .$type<DatabaseIdentifier>(),
            createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
            updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
        }
    }
}

export { DatabaseConstants }
