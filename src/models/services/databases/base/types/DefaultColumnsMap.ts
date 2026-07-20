import type { DatabaseConstants } from "@/oliverperzyk/globals/databases/base/DatabaseConstants"

/**
 * @summary The default columns map.
 * @description A mapping to the default columns.
 */
type DefaultColumnsMap = (typeof DatabaseConstants)["BASE_TABLES_COLUMNS"]

export type { DefaultColumnsMap }
