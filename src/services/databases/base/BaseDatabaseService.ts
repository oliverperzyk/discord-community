import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { DatabaseCountReturnType } from "@/oliverperzyk/models/services/databases/base/types/DatabaseCountReturnType"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import { Table, count, type SQL } from "drizzle-orm"

/**
 * @summary Base database service class.
 * @description A base class for all database services.
 */
abstract class BaseDatabaseService {
    /**
     * @summary Protected constructor.
     * @description Protected constructor to prevent instantiation, while allowing inheritance.
     */
    protected constructor() {}

    /**
     * @summary Not found cache flag.
     * @description A flag to indicate for cache microservice that the element was not found in the database.
     */
    protected static readonly NOT_FOUND_CACHE_FLAG: NotFoundCacheFlag = "__NOT_FOUND_CACHE_FLAG__"

    /**
     * @summary Default page size.
     * @description The default page size for the database service.
     */
    public static readonly DEFAULT_PAGE_SIZE: number = 20
    /**
     * @summary Page size.
     * @description The page size for the database service.
     */
    public static readonly PAGE_SIZE: number = BaseDatabaseService.DEFAULT_PAGE_SIZE

    /**
     * @summary Maximum creation attempts.
     * @description The maximum number of attempts to create an element.
     */
    public static readonly MAX_CREATION_ATTEMPTS: number = 3
    /**
     * @summary Maximum update attempts.
     * @description The maximum number of attempts to update an element.
     */
    public static readonly MAX_UPDATE_ATTEMPTS: number = 3

    /**
     * @summary Resolve single item query result.
     * @description Resolves the single item query result.
     * @param result The result to resolve the single item query result of.
     * @template T The type of the result to resolve the single item query result of.
     * @returns The single item query result.
     */
    protected static resolveSingleItemQueryResult<T>(result: T[]): T | null {
        return result.length === 0 ? null : result[0]
    }

    /**
     * @summary Resolve create element.
     * @description Resolves the creation date and time of the element and adds it to the entity.
     * @param element The element to resolve the creation date and time of.
     * @template CreatePayloadType The type of the element to resolve the creation date and time of.
     * @returns The element with the creation date and time added.
     */
    protected static resolveCreateElement<CreatePayloadType extends Record<string, unknown>>(
        element: CreatePayloadType,
    ): CreatePayloadType & { createdAt: Date; updatedAt: Date } {
        const date: Date = new Date()
        return {
            ...element,
            createdAt: date,
            updatedAt: date,
        }
    }

    /**
     * @summary Resolve update element.
     * @description Resolves the update date and time of the element and adds it to the entity.
     * @param element The element to resolve the update date and time of.
     * @template UpdatePayloadType The type of the element to resolve the update date and time of.
     * @returns The element with the update date and time added.
     */
    protected static resolveUpdateElement<UpdatePayloadType extends Record<string, unknown>>(
        element: UpdatePayloadType,
    ): UpdatePayloadType & { updatedAt: Date } {
        return {
            ...element,
            updatedAt: new Date(),
        }
    }

    /**
     * @summary Counts the entries in a table.
     * @description This method is used to count the entries in a table.
     * @param table - The table to count the entries in.
     * @param where - Optional where condition to filter the counted entries.
     * @returns The number of entries in the table.
     */
    protected static async countEntriesInTable(table: Table, where?: SQL): Promise<number> {
        const queriedValue: DatabaseCountReturnType = (await DatabaseClient.drizzleInstance
            .select({ count: count() })
            .from(table)
            .where(where)
            .execute()) as DatabaseCountReturnType
        return queriedValue[0].count ?? 0
    }
}

export { BaseDatabaseService }
