import { pgEnum } from "drizzle-orm/pg-core"
import type { IBaseEnumerationFunction } from "@/oliverperzyk/models/services/databases/base/interfaces/IBaseEnumerationFunction"

/**
 * @summary Creates a PostgreSQL enum.
 * @description Wraps `pgEnum` from Drizzle ORM.
 * @remarks The function behaves the same as `pgEnum` from `drizzle-orm/pg-core`, except that `readonly string[]` values are accepted without requiring a non-empty tuple.
 */
const baseEnum = ((enumName: string, values: readonly string[] | Record<string, string>) => {
    return pgEnum(enumName, values as never)
}) as unknown as IBaseEnumerationFunction

export { baseEnum }
