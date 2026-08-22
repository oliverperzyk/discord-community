import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { and, eq, type SQL } from "drizzle-orm"
import { testingThingsParticipantsTable } from "@/oliverperzyk/globals/databases/DatabaseSchemas"
import type { ITestingThingsParticipantPaginationFilterOptions } from "@/oliverperzyk/models/services/databases/testing/participants/ITestingThingsParticipantPaginationFilterOptions"
import type { IPaginationResult } from "@/oliverperzyk/models/services/databases/base/interfaces/IPaginationResult"
import type { ITestingThingsParticipant } from "@/oliverperzyk/models/services/databases/testing/participants/ITestingThingsParticipant"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { ITestingThingsParticipantCreatePayload } from "@/oliverperzyk/models/services/databases/testing/participants/ITestingThingsParticipantCreatePayload"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"

/**
 * @summary The testing things participants service class.
 * @description This class is used to manage the testing things participants.
 */
class TestingThingsParticipantsService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary Gets the participants count.
     * @description This method is used to get the participants count.
     * @param testingThingId The ID of the testing thing to get the participants count for.
     * @returns The participants count.
     */
    public static async getParticipantsCount(testingThingId?: DatabaseIdentifier): Promise<number> {
        const cacheKey: string = testingThingId
            ? `testingThingsParticipantsCount:${testingThingId}`
            : "testingThingsParticipantsCount"
        const cachedValue: number | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue
        const participantsCount: number = testingThingId
            ? await this.countEntriesInTable(
                  testingThingsParticipantsTable,
                  eq(testingThingsParticipantsTable.testingThingId, testingThingId),
              )
            : await this.countEntriesInTable(testingThingsParticipantsTable)

        await CacheClient.setValue(cacheKey, participantsCount)
        return participantsCount
    }

    /**
     * @summary Gets the participants by testing thing ID.
     * @description This method is used to get the participants by testing thing ID, used by delete methods.
     * @param testingThingId The ID of the testing thing to get the participants by.
     * @returns The participants by testing thing ID.
     */
    private static async internalGetParticipantsByTestingThingId(
        testingThingId: DatabaseIdentifier,
    ): Promise<ITestingThingsParticipant[]> {
        return await DatabaseClient.drizzleInstance
            .select()
            .from(testingThingsParticipantsTable)
            .where(eq(testingThingsParticipantsTable.testingThingId, testingThingId))
            .execute()
    }

    /**
     * @summary Gets the participants by user ID.
     * @description This method is used to get the participants by user ID, used by delete methods.
     * @param userId The ID of the user to get the participants by.
     * @returns The participants by user ID.
     */
    private static async internalGetParticipantsByUserId(
        userId: DiscordSnowflake,
    ): Promise<ITestingThingsParticipant[]> {
        return await DatabaseClient.drizzleInstance
            .select()
            .from(testingThingsParticipantsTable)
            .where(eq(testingThingsParticipantsTable.userId, userId))
            .execute()
    }

    /**
     * @summary Gets the participants.
     * @description This method is used to get the participants.
     * @param page The page number to get the participants for.
     * @param options The options to get the participants by.
     * @returns The participants.
     */
    public static async getParticipants(
        page: number,
        options?: ITestingThingsParticipantPaginationFilterOptions,
    ): Promise<IPaginationResult<ITestingThingsParticipant>> {
        const cacheKey: string = `testingThingsParticipants:${page}:${JSON.stringify(options)}`
        const cachedValue: IPaginationResult<ITestingThingsParticipant> | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const where: SQL | undefined = and(
            options?.testingThingId
                ? eq(testingThingsParticipantsTable.testingThingId, options.testingThingId)
                : undefined,
            options?.userId ? eq(testingThingsParticipantsTable.userId, options.userId) : undefined,
        )

        const queriedValues: ITestingThingsParticipant[] = await DatabaseClient.drizzleInstance
            .select()
            .from(testingThingsParticipantsTable)
            .where(where)
            .limit(this.PAGE_SIZE)
            .offset((page - 1) * this.PAGE_SIZE)
            .execute()
        const result: IPaginationResult<ITestingThingsParticipant> = {
            items: queriedValues,
            totalCount: await this.countEntriesInTable(testingThingsParticipantsTable, where),
        }

        await CacheClient.setValue(cacheKey, result)
        return result
    }

    /**
     * @summary Gets the participant by ID.
     * @description This method is used to get the participant by ID.
     * @param id The ID of the participant to get.
     * @returns The participant by ID.
     */
    public static async getParticipantById(id: DatabaseIdentifier): Promise<ITestingThingsParticipant | null> {
        const cacheKey: string = `testingThingsParticipant:${id}`
        const cachedValue: ITestingThingsParticipant | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue
        const queriedValue: ITestingThingsParticipant | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(testingThingsParticipantsTable)
                .where(eq(testingThingsParticipantsTable.id, id))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the participant by entry.
     * @description This method is used to get the participant by entry.
     * @param testingThingId The ID of the testing thing to get the participant by.
     * @param userId The ID of the user to get the participant by.
     * @returns The participant by entry.
     */
    public static async getParticipantByEntry(
        testingThingId: DatabaseIdentifier,
        userId: DiscordSnowflake,
    ): Promise<ITestingThingsParticipant | null> {
        const cacheKey: string = `testingThingsParticipantByEntry:${testingThingId}:${userId}`
        const cachedValue: ITestingThingsParticipant | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue
        const queriedValue: ITestingThingsParticipant | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(testingThingsParticipantsTable)
                .where(
                    and(
                        eq(testingThingsParticipantsTable.testingThingId, testingThingId),
                        eq(testingThingsParticipantsTable.userId, userId),
                    ),
                )
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates a participant.
     * @description This method is used to create a participant.
     * @param payload The payload to create the participant with.
     * @returns The created participant.
     */
    public static async createParticipant(
        payload: ITestingThingsParticipantCreatePayload,
    ): Promise<ITestingThingsParticipant | null> {
        if (payload.testingThingId === undefined || payload.userId === undefined) return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if (await this.getParticipantById(id)) continue

            const testingThingParticipant: ITestingThingsParticipant = this.resolveCreateElement({
                id,
                ...payload,
            })

            await DatabaseClient.drizzleInstance
                .insert(testingThingsParticipantsTable)
                .values(testingThingParticipant)
                .execute()
            await CacheClient.deleteValuesByPattern(
                `testingThingsParticipantsCount`,
                `testingThingsParticipantsConut:${payload.testingThingId}`,
                `testingThingsParticipants:*`,
                `testingThingsParticipant:${id}`,
                `testingThingsParticipantByEntry:${payload.testingThingId}:${payload.userId}`,
            )
            return testingThingParticipant
        }

        return null
    }

    /**
     * @summary Deletes a participant by ID.
     * @description This method is used to delete a participant by ID.
     * @param id The ID of the participant to delete.
     * @returns True if the participant was deleted, false otherwise.
     */
    public static async deleteParticipantById(id: DatabaseIdentifier): Promise<boolean> {
        const testingThingParticipant: ITestingThingsParticipant | null = await this.getParticipantById(id)
        if (testingThingParticipant === null) return false

        await DatabaseClient.drizzleInstance
            .delete(testingThingsParticipantsTable)
            .where(eq(testingThingsParticipantsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `testingThingsParticipantsCount`,
            `testingThingsParticipantsConut:${testingThingParticipant.testingThingId}`,
            `testingThingsParticipants:*`,
            `testingThingsParticipant:${id}`,
            `testingThingsParticipantByEntry:${testingThingParticipant.testingThingId}:${testingThingParticipant.userId}`,
        )
        return true
    }

    /**
     * @summary Deletes participants by testing thing ID.
     * @description This method is used to delete participants by testing thing ID.
     * @param testingThingId The ID of the testing thing to delete the participants for.
     * @returns The number of participants deleted.
     */
    public static async deleteParticipantsByTestingThingId(testingThingId: DatabaseIdentifier): Promise<number> {
        const testingThingParticipants: ITestingThingsParticipant[] =
            await this.internalGetParticipantsByTestingThingId(testingThingId)
        if (testingThingParticipants.length === 0) return 0

        await DatabaseClient.drizzleInstance
            .delete(testingThingsParticipantsTable)
            .where(eq(testingThingsParticipantsTable.testingThingId, testingThingId))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `testingThingsParticipantsCount`,
            `testingThingsParticipantsConut:${testingThingId}`,
            `testingThingsParticipants:*`,
            ...testingThingParticipants.flatMap(({ id, userId }: ITestingThingsParticipant): readonly string[] => [
                `testingThingsParticipant:${id}`,
                `testingThingsParticipantByEntry:${testingThingId}:${userId}`,
            ]),
        )
        return testingThingParticipants.length
    }

    /**
     * @summary Deletes participants by user ID.
     * @description This method is used to delete participants by user ID.
     * @param userId The ID of the user to delete the participants for.
     * @returns The number of participants deleted.
     */
    public static async deleteParticipantsByUserId(userId: DiscordSnowflake): Promise<number> {
        const testingThingParticipants: ITestingThingsParticipant[] = await this.internalGetParticipantsByUserId(userId)
        if (testingThingParticipants.length === 0) return 0

        await DatabaseClient.drizzleInstance
            .delete(testingThingsParticipantsTable)
            .where(eq(testingThingsParticipantsTable.userId, userId))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `testingThingsParticipantsCount`,
            `testingThingsParticipants:*`,
            ...testingThingParticipants.flatMap(
                ({ id, testingThingId }: ITestingThingsParticipant): readonly string[] => [
                    `testingThingsParticipant:${id}`,
                    `testingThingsParticipantByEntry:${testingThingId}:${userId}`,
                    `testingThingsParticipantsCount:${testingThingId}`,
                ],
            ),
        )
        return testingThingParticipants.length
    }
}

export { TestingThingsParticipantsService }
