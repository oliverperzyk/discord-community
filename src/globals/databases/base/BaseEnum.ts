/* eslint-disable no-redeclare */
import type { NonArray, Writable } from "drizzle-orm"
import { pgEnum } from "drizzle-orm/pg-core"
import type { PgEnum, PgEnumObject } from "drizzle-orm/pg-core/columns/enum"

/**
 * @summary A type for the values of a base enum.
 * @description A type for the values of a base enum, used to create a mutable array from a readonly array.
 * @template T - The type of the values of the base enum.
 */
type BaseEnumValues<T extends Readonly<string[]>> =
    T extends Readonly<[string, ...string[]]> ? Writable<T> : [string, ...string[]]

/**
 * @summary A type for the values of a base enum.
 * @description A type for a base enum, used to distinguish readonly arrays from mutable arrays.
 * @template T - The type of the values of the base enum.
 */
type ReadonlyOnly<T extends Readonly<string[]>> = T extends string[] ? never : T

/**
 * @summary A base helper function to create PostgreSQL enums.
 * @description Wraps `pgEnum` with the same tuple and object value overloads.
 * @param engineName - The PostgreSQL enum type name.
 * @param values - Enum member values as a readonly string array.
 * @returns The Drizzle enum instance.
 */
function baseEnum<T extends Readonly<string[]>>(
    _engineName: string,
    _values: ReadonlyOnly<T>,
): PgEnum<BaseEnumValues<T>>

/**
 * @summary A base helper function to create PostgreSQL enums.
 * @description Requires mutable arrays to be explicit non-empty tuples.
 * @param engineName - The PostgreSQL enum type name.
 * @param values - Enum member values as a mutable non-empty tuple.
 * @returns The Drizzle enum instance.
 */
function baseEnum<U extends string, T extends [U, ...U[]]>(_engineName: string, _values: T): PgEnum<T>

/**
 * @summary A base helper function to create PostgreSQL enums.
 * @description Wraps `pgEnum` with the same tuple and object value overloads.
 * @param engineName - The PostgreSQL enum type name.
 * @param enumObj - Enum member values as a string enum object.
 * @returns The Drizzle enum instance.
 */
function baseEnum<E extends Record<string, string>>(_engineName: string, _enumObj: NonArray<E>): PgEnumObject<E>

function baseEnum(engineName: string, valuesOrEnumObj: unknown): unknown {
    return pgEnum(engineName, valuesOrEnumObj as never)
}

export { baseEnum }
