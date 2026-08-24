import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { testingThingsTranslationsTable } from "@/oliverperzyk/globals/databases/DatabaseSchemas"
import { and, desc, eq } from "drizzle-orm"
import type { ITestingThingsTranslation } from "@/oliverperzyk/models/services/databases/testing/translations/ITestingThingsTranslation"
import type { IPaginationResult } from "@/oliverperzyk/models/services/databases/base/interfaces/IPaginationResult"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import type { ITestingThingsTranslationCreatePayload } from "@/oliverperzyk/models/services/databases/testing/translations/ITestingThingsTranslationCreatePayload"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"
import type { ITestingThingsTranslationUpdatePayload } from "@/oliverperzyk/models/services/databases/testing/translations/ITestingThingsTranslationUpdatePayload"

/**
 * @summary The testing things translations service.
 * @description This service is used to manage the testing things translations.
 */
class TestingThingsTranslationsService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary Gets the count of testing things translations.
     * @description This method is used to get the count of testing things translations.
     * @param testingThingId The ID of the testing thing to get the count of translations for.
     * @returns The count of testing things translations.
     */
    public static async getTestingThingsTranslationsCount(testingThingId: DatabaseIdentifier): Promise<number> {
        const cacheKey = `testingThingsTranslationsCount:${testingThingId}`
        const cachedValue: number | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: number = await this.countEntriesInTable(
            testingThingsTranslationsTable,
            eq(testingThingsTranslationsTable.testingThingId, testingThingId),
        )
        await CacheClient.setValue(cacheKey, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the testing things translations.
     * @description This method is used to get the testing things translations.
     * @param testingThingId The ID of the testing thing to get the translations for.
     * @returns The testing things translations.
     */
    private static async internalGetTestingThingsTranslations(
        testingThingId: DatabaseIdentifier,
    ): Promise<ITestingThingsTranslation[]> {
        return await DatabaseClient.drizzleInstance
            .select()
            .from(testingThingsTranslationsTable)
            .where(eq(testingThingsTranslationsTable.testingThingId, testingThingId))
            .execute()
    }

    /**
     * @summary Gets the testing things translations by page.
     * @description This method is used to get the testing things translations by page.
     * @param page The page number to get the translations for.
     * @param testingThingId The ID of the testing thing to get the translations for.
     * @returns The pagination result of the testing things translations.
     */
    public static async getTestingThingsTranslationsByPage(
        page: number,
        testingThingId: DatabaseIdentifier,
    ): Promise<IPaginationResult<ITestingThingsTranslation>> {
        const cacheKey = `testingThingsTranslationsByPage:${testingThingId}:${page}`
        const cachedValue: IPaginationResult<ITestingThingsTranslation> | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: ITestingThingsTranslation[] = await DatabaseClient.drizzleInstance
            .select()
            .from(testingThingsTranslationsTable)
            .where(eq(testingThingsTranslationsTable.testingThingId, testingThingId))
            .limit(10)
            .offset((page - 1) * 10)
            .orderBy(desc(testingThingsTranslationsTable.language))
            .execute()
        const result: IPaginationResult<ITestingThingsTranslation> = {
            items: queriedValue,
            totalCount: await this.getTestingThingsTranslationsCount(testingThingId),
        }

        await CacheClient.setValue(cacheKey, result)
        return result
    }

    /**
     * @summary Gets the testing things translation by ID.
     * @description This method is used to get the testing things translation by ID.
     * @param id The ID of the testing things translation to get.
     * @returns The testing things translation by ID.
     */
    public static async getTestingThingsTranslationById(
        id: DatabaseIdentifier,
    ): Promise<ITestingThingsTranslation | null> {
        const cacheKey = `testingThingsTranslationById:${id}`
        const cachedValue: ITestingThingsTranslation | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: ITestingThingsTranslation | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(testingThingsTranslationsTable)
                .where(eq(testingThingsTranslationsTable.id, id))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the testing things translation by testing thing ID and language.
     * @description This method is used to get the testing things translation by testing thing ID and language.
     * @param testingThingId The ID of the testing thing to get the translation for.
     * @param language The language of the testing things translation to get.
     * @returns The testing things translation by testing thing ID and language.
     */
    public static async getTestingThingsTranslationByTestingThingIdAndLanguage(
        testingThingId: DatabaseIdentifier,
        language: Language,
    ): Promise<ITestingThingsTranslation | null> {
        const cacheKey = `testingThingsTranslationByTestingThingIdAndLanguage:${testingThingId}:${language}`
        const cachedValue: ITestingThingsTranslation | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: ITestingThingsTranslation | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(testingThingsTranslationsTable)
                .where(
                    and(
                        eq(testingThingsTranslationsTable.testingThingId, testingThingId),
                        eq(testingThingsTranslationsTable.language, language),
                    ),
                )
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates a new testing things translation.
     * @description This method is used to create a new testing things translation.
     * @param payload The payload of the testing things translation to create.
     * @returns The created testing things translation or null if the creation failed.
     */
    public static async createTestingThingsTranslation(
        payload: ITestingThingsTranslationCreatePayload,
    ): Promise<ITestingThingsTranslation | null> {
        if (await this.getTestingThingsTranslationByTestingThingIdAndLanguage(payload.testingThingId, payload.language))
            return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if ((await this.getTestingThingsTranslationById(id)) === null) {
                const translation: ITestingThingsTranslation = this.resolveCreateElement({
                    id,
                    ...payload,
                })

                await DatabaseClient.drizzleInstance
                    .insert(testingThingsTranslationsTable)
                    .values(translation)
                    .execute()
                await CacheClient.deleteValuesByPattern(
                    `testingThingsTranslationsCount:${payload.testingThingId}`,
                    `testingThingsTranslationsByPage:*`,
                    `testingThingsTranslationById:${id}`,
                    `testingThingsTranslationByTestingThingIdAndLanguage:${payload.testingThingId}:${payload.language}`,
                )
                return translation
            }
        }
        return null
    }

    /**
     * @summary Updates a testing things translation.
     * @description This method is used to update a testing things translation.
     * @param id The ID of the testing things translation to update.
     * @param payload The payload of the testing things translation to update.
     * @returns The updated testing things translation or null if the update failed.
     */
    public static async updateTestingThingsTranslation(
        id: DatabaseIdentifier,
        payload: ITestingThingsTranslationUpdatePayload,
    ): Promise<ITestingThingsTranslation | null> {
        const testingThingsTranslation: ITestingThingsTranslation | null =
            await this.getTestingThingsTranslationById(id)
        if (testingThingsTranslation === null) return null

        const updatedTranslation: ITestingThingsTranslation = this.resolveUpdateElement({
            ...testingThingsTranslation,
            ...payload,
        })

        await DatabaseClient.drizzleInstance
            .update(testingThingsTranslationsTable)
            .set(updatedTranslation)
            .where(eq(testingThingsTranslationsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `testingThingsTranslationsCount:${testingThingsTranslation.testingThingId}`,
            `testingThingsTranslationsByPage:*`,
            `testingThingsTranslationById:${id}`,
            `testingThingsTranslationByTestingThingIdAndLanguage:${testingThingsTranslation.testingThingId}:${testingThingsTranslation.language}`,
        )
        return updatedTranslation
    }

    /**
     * @summary Deletes a testing things translation by ID.
     * @description This method is used to delete a testing things translation by ID.
     * @param id The ID of the testing things translation to delete.
     * @returns True if the testing things translation was deleted, false otherwise.
     */
    public static async deleteTestingThingsTranslationById(id: DatabaseIdentifier): Promise<boolean> {
        const testingThingsTranslation: ITestingThingsTranslation | null =
            await this.getTestingThingsTranslationById(id)
        if (testingThingsTranslation === null) return false

        await DatabaseClient.drizzleInstance
            .delete(testingThingsTranslationsTable)
            .where(eq(testingThingsTranslationsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `testingThingsTranslationsCount:${testingThingsTranslation.testingThingId}`,
            `testingThingsTranslationsByPage:*`,
            `testingThingsTranslationById:${id}`,
            `testingThingsTranslationByTestingThingIdAndLanguage:${testingThingsTranslation.testingThingId}:${testingThingsTranslation.language}`,
        )
        return true
    }

    /**
     * @summary Deletes the testing things translations by testing thing ID.
     * @description This method is used to delete the testing things translations by testing thing ID.
     * @param testingThingId The ID of the testing thing to delete the translations for.
     * @returns Count of deleted testing things translations.
     */
    public static async deleteTestingThingsTranslationsByTestingThingId(
        testingThingId: DatabaseIdentifier,
    ): Promise<number> {
        if ((await this.getTestingThingsTranslationsCount(testingThingId)) === 0) return 0
        const testingThingsTranslations: ITestingThingsTranslation[] =
            await this.internalGetTestingThingsTranslations(testingThingId)
        await DatabaseClient.drizzleInstance
            .delete(testingThingsTranslationsTable)
            .where(eq(testingThingsTranslationsTable.testingThingId, testingThingId))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `testingThingsTranslationsCount:${testingThingId}`,
            `testingThingsTranslationsByPage:*`,
            ...testingThingsTranslations.flatMap(({ id, language }: ITestingThingsTranslation): readonly string[] => [
                `testingThingsTranslationById:${id}`,
                `testingThingsTranslationByTestingThingIdAndLanguage:${testingThingId}:${language}`,
            ]),
        )

        return testingThingsTranslations.length
    }
}

export { TestingThingsTranslationsService }
