import type { NonArray, Writable } from "drizzle-orm"
import type { PgEnum, PgEnumObject } from "drizzle-orm/pg-core"

/**
 * @summary Function signature for creating PostgreSQL enums.
 * @description Mirrors `pgEnum` from Drizzle ORM, with relaxed typing for `readonly string[]` values.
 */
interface IBaseEnumerationFunction {
    /**
     * @summary Creates a PostgreSQL enum from a non-empty tuple of values.
     * @param enumName - The enum name.
     * @param values - The enum values.
     */
    <U extends string, T extends Readonly<[U, ...U[]]>>(enumName: string, values: T | Writable<T>): PgEnum<Writable<T>>

    /**
     * @summary Creates a PostgreSQL enum from a readonly string array.
     * @param enumName - The enum name.
     * @param values - The enum values.
     * @remarks This overload accepts any `readonly string[]` without requiring a non-empty tuple.
     */
    (enumName: string, values: readonly string[]): PgEnum<[string, ...string[]]>

    /**
     * @summary Creates a PostgreSQL enum from an object.
     * @param enumName - The enum name.
     * @param enumObj - The enum object.
     */
    <E extends Record<string, string>>(enumName: string, enumObj: NonArray<E>): PgEnumObject<E>
}

export type { IBaseEnumerationFunction }
