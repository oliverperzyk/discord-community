import type { PgColumnBuilderBase } from "drizzle-orm/pg-core"

/**
 * @summary The user-defined columns of a base table.
 * @description Column builders provided by the caller, excluding the default columns added by `baseTable`.
 */
type UserColumns<T extends Record<string, PgColumnBuilderBase>> = T

export type { UserColumns }
