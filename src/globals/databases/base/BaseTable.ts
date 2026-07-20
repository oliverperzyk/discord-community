import { DatabaseConstants } from "@/oliverperzyk/globals/databases/base/DatabaseConstants"
import { UpdatedAtTriggersManager } from "@/oliverperzyk/globals/databases/base/triggers/UpdatedAtTriggersManager"
import { pgTable, type PgTableExtraConfig, type PgTableExtraConfigValue, type PgTableFn } from "drizzle-orm/pg-core"

/**
 * @summary Wraps a table's extra config callback to append the updated-at trigger.
 * @param tableName - The table name.
 * @param extraConfig - The user-provided extra config callback.
 * @returns The merged extra config callback.
 */
function wrapExtraConfig<TSelf>(
    tableName: string,
    extraConfig?: (self: TSelf) => PgTableExtraConfig | PgTableExtraConfigValue[],
): (self: TSelf) => PgTableExtraConfigValue[] {
    return (self: TSelf) => {
        const updatedAtTrigger: PgTableExtraConfigValue = UpdatedAtTriggersManager.createUpdatedAtTrigger(tableName)

        if (!extraConfig) {
            return [updatedAtTrigger]
        }

        const userExtraConfig: PgTableExtraConfig | PgTableExtraConfigValue[] = extraConfig(self)

        if (Array.isArray(userExtraConfig)) {
            return [...userExtraConfig, updatedAtTrigger]
        }

        return [...Object.values(userExtraConfig), updatedAtTrigger]
    }
}

/**
 * @summary Creates a PostgreSQL table with shared base columns and an updated-at trigger.
 * @description Wraps `pgTable` from Drizzle ORM and automatically adds `id`, `createdAt`, and `updatedAt` columns.
 * @remarks The function behaves the same as `pgTable` from `drizzle-orm/pg-core`.
 */
const baseTable: PgTableFn = (name, columns, extraConfig?) => {
    if (typeof columns === "function") {
        return pgTable(
            name,
            (columnTypes) => ({
                ...DatabaseConstants.BASE_TABLES_COLUMNS,
                ...columns(columnTypes),
            }),
            wrapExtraConfig(name, extraConfig),
        )
    }

    return pgTable(
        name,
        {
            ...DatabaseConstants.BASE_TABLES_COLUMNS,
            ...columns,
        },
        wrapExtraConfig(name, extraConfig),
    )
}

export { baseTable }
