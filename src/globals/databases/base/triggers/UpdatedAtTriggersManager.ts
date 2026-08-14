import { sql } from "drizzle-orm"
import type { PgTableExtraConfigValue } from "drizzle-orm/pg-core"
import { UpdatedAtTrigger } from "./UpdatedAtTrigger"

/**
 * @summary Manager for updated-at PostgreSQL triggers.
 * @description Provides trigger definitions and SQL for base tables.
 */
class UpdatedAtTriggersManager {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The updated-at column name.
     */
    public static readonly UPDATED_AT_COLUMN_NAME: string = "updatedAt"

    /**
     * @summary The shared trigger function name.
     */
    public static readonly TRIGGER_FUNCTION_NAME: string = "set_updated_at"

    /**
     * @summary SQL for creating the shared updated-at trigger function.
     */
    public static readonly TRIGGER_FUNCTION_SQL: string = `
CREATE OR REPLACE FUNCTION "${UpdatedAtTriggersManager.TRIGGER_FUNCTION_NAME}"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW."${UpdatedAtTriggersManager.UPDATED_AT_COLUMN_NAME}" = NOW();
    RETURN NEW;
END;
$$;`.trim()

    /**
     * @summary Get the trigger name for a table.
     * @param tableName - The table name.
     * @returns The trigger name.
     */
    public static getTriggerName(tableName: string): string {
        return `${tableName}_set_updated_at`
    }

    /**
     * @summary Get SQL for creating an updated-at trigger on a table.
     * @param tableName - The table name.
     * @returns SQL for creating the trigger.
     */
    public static getTriggerSql(tableName: string): string {
        return `
CREATE TRIGGER "${UpdatedAtTriggersManager.getTriggerName(tableName)}"
BEFORE UPDATE ON "${tableName}"
FOR EACH ROW
EXECUTE FUNCTION "${UpdatedAtTriggersManager.TRIGGER_FUNCTION_NAME}"();`.trim()
    }

    /**
     * @summary Create an updated-at trigger definition for a table's extra config.
     * @param tableName - The table name.
     * @returns Trigger definition compatible with Drizzle table extra config.
     */
    public static createUpdatedAtTrigger(tableName: string): PgTableExtraConfigValue {
        return new UpdatedAtTrigger(UpdatedAtTriggersManager.getTriggerName(tableName), {
            when: "BEFORE",
            events: ["UPDATE"],
            forEach: "ROW",
            execute: sql.raw(`"${UpdatedAtTriggersManager.TRIGGER_FUNCTION_NAME}"()`),
        }) as PgTableExtraConfigValue
    }
}

export { UpdatedAtTriggersManager }
