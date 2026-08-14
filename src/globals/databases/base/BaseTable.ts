/* eslint-disable no-redeclare */
import type { BuildExtraConfigColumns } from "drizzle-orm"
import type { DefaultColumnsMap } from "@/oliverperzyk/models/services/databases/base/types/DefaultColumnsMap"
import type { PgColumnsBuilders } from "drizzle-orm/pg-core/columns/all"
import type { UserColumns } from "@/oliverperzyk/models/services/databases/base/types/UserColumns"
import {
    pgTable,
    type PgColumnBuilderBase,
    type PgTableExtraConfig,
    type PgTableExtraConfigValue,
} from "drizzle-orm/pg-core"
import { DatabaseConstants } from "./DatabaseConstants"
import { UpdatedAtTriggersManager } from "./triggers/UpdatedAtTriggersManager"

type BaseTableColumns<T extends Record<string, PgColumnBuilderBase>> = Omit<DefaultColumnsMap, keyof T> & T
type BaseTableColumnsInput<T extends Record<string, PgColumnBuilderBase>> =
    | UserColumns<T>
    | ((_builders: PgColumnsBuilders) => UserColumns<T>)
type BaseTableColumnsOutput<T extends Record<string, PgColumnBuilderBase>> =
    | BaseTableColumns<T>
    | ((_builders: PgColumnsBuilders) => BaseTableColumns<T>)
type BaseTableReturn<TName extends string, T extends Record<string, PgColumnBuilderBase>> = ReturnType<
    typeof pgTable<TName, BaseTableColumns<T>>
>

/**
 * @summary Merges the user columns with the default columns.
 * @description Merges the user columns with the default columns.
 * @param columns - The columns of the table.
 * @returns The merged columns.
 */
function mergeColumns<T extends Record<string, PgColumnBuilderBase>>(
    columns: BaseTableColumnsInput<T>,
): BaseTableColumnsOutput<T> {
    const defaults: DefaultColumnsMap = DatabaseConstants.BASE_TABLES_COLUMNS

    return typeof columns === "function"
        ? (_builders: PgColumnsBuilders) => ({ ...defaults, ...columns(_builders) }) as BaseTableColumns<T>
        : ({ ...defaults, ...columns } as BaseTableColumns<T>)
}

/**
 * @summary Wraps a table's extra config callback to append the updated-at trigger.
 * @param tableName - The table name.
 * @param extraConfig - The user-provided extra config callback.
 * @returns The merged extra config callback.
 */
function wrapExtraConfig<TName extends string, T extends Record<string, PgColumnBuilderBase>>(
    tableName: string,
    extraConfig?: (
        self: BuildExtraConfigColumns<TName, BaseTableColumns<T>, "pg">,
    ) => PgTableExtraConfig | PgTableExtraConfigValue[],
): (self: BuildExtraConfigColumns<TName, BaseTableColumns<T>, "pg">) => PgTableExtraConfigValue[] {
    return (self) => {
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
 * @summary A base helper function to create tables with default columns.
 * @description A base helper function to create tables with default columns and an updated-at trigger.
 * @param name - The name of the table.
 * @param columns - The columns of the table.
 * @returns The table.
 */
function baseTable<TName extends string, T extends Record<string, PgColumnBuilderBase>>(
    _name: TName,
    _columns: BaseTableColumnsInput<T>,
): BaseTableReturn<TName, T>
/**
 * @summary A base helper function to create tables with default columns.
 * @description A base helper function to create tables with default columns and an updated-at trigger.
 * @param name - The name of the table.
 * @param columns - The columns of the table.
 * @param extraConfig - The extra configuration of the table.
 * @returns The table.
 */
function baseTable<TName extends string, T extends Record<string, PgColumnBuilderBase>>(
    _name: TName,
    _columns: BaseTableColumnsInput<T>,
    _extraConfig: (
        _self: BuildExtraConfigColumns<TName, BaseTableColumns<T>, "pg">,
    ) => PgTableExtraConfig | PgTableExtraConfigValue[],
): BaseTableReturn<TName, T>
function baseTable<TName extends string, T extends Record<string, PgColumnBuilderBase>>(
    name: TName,
    columns: BaseTableColumnsInput<T>,
    extraConfig?: (
        _self: BuildExtraConfigColumns<TName, BaseTableColumns<T>, "pg">,
    ) => PgTableExtraConfig | PgTableExtraConfigValue[],
): BaseTableReturn<TName, T> {
    const wrappedExtraConfig = wrapExtraConfig(name, extraConfig)

    if (typeof columns === "function") {
        return pgTable(
            name,
            mergeColumns(columns) as (_builders: PgColumnsBuilders) => BaseTableColumns<T>,
            wrappedExtraConfig,
        ) as unknown as BaseTableReturn<TName, T>
    }

    return pgTable(
        name,
        mergeColumns(columns) as BaseTableColumns<T>,
        wrappedExtraConfig,
    ) as unknown as BaseTableReturn<TName, T>
}

export { baseTable, type UserColumns }
