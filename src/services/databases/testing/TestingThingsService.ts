import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { testingThingsTable } from "@/oliverperzyk/globals/databases/DatabaseSchemas"
import type { IPaginationResult } from "@/oliverperzyk/models/services/databases/base/interfaces/IPaginationResult"
import type { ITestingThing } from "@/oliverperzyk/models/services/databases/testing/base/ITestingThing"
import type { ITestingThingPaginationFilterOptions } from "@/oliverperzyk/models/services/databases/testing/base/ITestingThingPaginationFilterOptions"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import { and, desc, eq, gte, isNotNull, lte, type SQL } from "drizzle-orm"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { ITestingThingCreatePayload } from "@/oliverperzyk/models/services/databases/testing/base/ITestingThingCreatePayload"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"
import type { ITestingThingUpdatePayload } from "@/oliverperzyk/models/services/databases/testing/base/ITestingThingUpdatePayload"

/**
 * @summary The testing things service.
 * @description This service is used to manage the testing things.
 */
class TestingThingsService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary The testing things count cache key.
     * @description The cache key for the testing things count.
     */
    private static readonly TESTING_THINGS_COUNT_CACHE_KEY: string = "testingThingsCount"

    /**
     * @summary Gets the testing things count.
     * @description This method is used to get the testing things count.
     * @returns The testing things count.
     */
    public static async getTestingThingsCount(): Promise<number> {
        const cachedValue: number | null = await CacheClient.getValue(this.TESTING_THINGS_COUNT_CACHE_KEY)
        if (cachedValue !== null) return cachedValue
        const queriedValue: number = await this.countEntriesInTable(testingThingsTable)
        await CacheClient.setValue(this.TESTING_THINGS_COUNT_CACHE_KEY, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the testing things by page.
     * @description This method is used to get the testing things by page.
     * @param page The page number.
     * @param options The pagination filter options.
     * @returns The testing things by page.
     */
    public static async getTestingThingsByPage(
        page: number,
        options?: ITestingThingPaginationFilterOptions,
    ): Promise<IPaginationResult<ITestingThing>> {
        const cacheKey: string = `testingThingsByPage:${page}:${JSON.stringify(options)}`
        const cachedValue: IPaginationResult<ITestingThing> | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const where: SQL | undefined = and(
            options?.guildId ? eq(testingThingsTable.guildId, options.guildId) : undefined,
            options?.minimumMaxParticipants !== undefined
                ? and(
                      gte(testingThingsTable.maxParticipants, options.minimumMaxParticipants),
                      isNotNull(testingThingsTable.maxParticipants),
                  )
                : undefined,
            options?.maximumMaxParticipants !== undefined
                ? and(
                      lte(testingThingsTable.maxParticipants, options.maximumMaxParticipants),
                      isNotNull(testingThingsTable.maxParticipants),
                  )
                : undefined,
            options?.startsAt ? gte(testingThingsTable.startsAt, options.startsAt) : undefined,
            options?.endsAt ? lte(testingThingsTable.endsAt, options.endsAt) : undefined,
        )

        const queriedValues: ITestingThing[] = await DatabaseClient.drizzleInstance
            .select()
            .from(testingThingsTable)
            .where(where)
            .orderBy(desc(testingThingsTable.createdAt))
            .offset((page - 1) * this.PAGE_SIZE)
            .limit(this.PAGE_SIZE)
            .execute()
        const result: IPaginationResult<ITestingThing> = {
            items: queriedValues,
            totalCount: await this.countEntriesInTable(testingThingsTable, where),
        }

        await CacheClient.setValue(cacheKey, result)
        return result
    }

    /**
     * @summary Gets the testing thing by ID.
     * @description This method is used to get the testing thing by ID.
     * @param id The ID of the testing thing.
     * @returns The testing thing.
     */
    public static async getTestingThingById(id: DatabaseIdentifier): Promise<ITestingThing | null> {
        const cacheKey: string = `testingThingById:${id}`
        const cachedValue: ITestingThing | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: ITestingThing | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(testingThingsTable)
                .where(eq(testingThingsTable.id, id))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the testing thing by guild ID and channel name.
     * @description This method is used to get the testing thing by guild ID and channel name.
     * @param guildId The ID of the guild.
     * @param channelName The name of the channel.
     * @returns The testing thing.
     */
    public static async getTestingThingByGuildIdAndChannelName(
        guildId: DiscordSnowflake,
        channelName: string,
    ): Promise<ITestingThing | null> {
        const cacheKey: string = `testingThingByGuildIdAndChannelName:${guildId}:${channelName}`
        const cachedValue: ITestingThing | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: ITestingThing | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(testingThingsTable)
                .where(and(eq(testingThingsTable.guildId, guildId), eq(testingThingsTable.channelName, channelName)))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates a testing thing.
     * @description This method is used to create a testing thing.
     * @param payload The payload for the testing thing.
     * @returns The testing thing.
     */
    public static async createTestingThing(payload: ITestingThingCreatePayload): Promise<ITestingThing | null> {
        if (await this.getTestingThingByGuildIdAndChannelName(payload.guildId, payload.channelName)) return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if (await this.getTestingThingById(id)) continue

            const testingThing: ITestingThing = this.resolveCreateElement({
                id,
                ...payload,
            })

            await DatabaseClient.drizzleInstance.insert(testingThingsTable).values(testingThing).execute()
            await CacheClient.deleteValuesByPattern(
                this.TESTING_THINGS_COUNT_CACHE_KEY,
                `testingThingsByPage:*`,
                `testingThingById:${id}`,
                `testingThingByGuildIdAndChannelName:${payload.guildId}:${payload.channelName}`,
            )

            return testingThing
        }

        return null
    }

    /**
     * @summary Updates a testing thing.
     * @description This method is used to update a testing thing.
     * @param id The ID of the testing thing.
     * @param payload The payload for the testing thing.
     * @returns The testing thing.
     */
    public static async updateTestingThing(
        id: DatabaseIdentifier,
        payload: ITestingThingUpdatePayload,
    ): Promise<ITestingThing | null> {
        const testingThing: ITestingThing | null = await this.getTestingThingById(id)
        if (!testingThing) return null

        const updatedTestingThing: ITestingThing = this.resolveUpdateElement({
            ...testingThing,
            ...payload,
        })

        await DatabaseClient.drizzleInstance
            .update(testingThingsTable)
            .set(updatedTestingThing)
            .where(eq(testingThingsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `testingThingsByPage:*`,
            `testingThingById:${id}`,
            `testingThingByGuildIdAndChannelName:${testingThing.guildId}:${testingThing.channelName}`,
            `testingThingByGuildIdAndChannelName:${updatedTestingThing.guildId}:${updatedTestingThing.channelName}`,
        )
        return updatedTestingThing
    }

    /**
     * @summary Deletes a testing thing by ID.
     * @description This method is used to delete a testing thing by ID.
     * @param id The ID of the testing thing.
     * @returns The result of the deletion.
     */
    public static async deleteTestingThingById(id: DatabaseIdentifier): Promise<boolean> {
        const testingThing: ITestingThing | null = await this.getTestingThingById(id)
        if (!testingThing) return false

        await DatabaseClient.drizzleInstance.delete(testingThingsTable).where(eq(testingThingsTable.id, id)).execute()
        await CacheClient.deleteValuesByPattern(
            this.TESTING_THINGS_COUNT_CACHE_KEY,
            `testingThingsByPage:*`,
            `testingThingById:${id}`,
            `testingThingByGuildIdAndChannelName:${testingThing.guildId}:${testingThing.channelName}`,
        )
        return true
    }
}

export { TestingThingsService }
