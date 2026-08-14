import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { giveawaysTranslationsTable } from "@/oliverperzyk/globals/databases/giveaways/GiveawaysTranslationsSchemas"
import { and, desc, eq } from "drizzle-orm"
import type { IGiveawaysTranslation } from "@/oliverperzyk/models/services/databases/giveaways/translations/interfaces/IGiveawaysTranslation"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import type { IGiveawaysTranslationCreatePayload } from "@/oliverperzyk/models/services/databases/giveaways/translations/interfaces/IGiveawaysTranslationCreatePayload"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"
import type { IGiveawaysTranslationUpdatePayload } from "@/oliverperzyk/models/services/databases/giveaways/translations/interfaces/IGiveawaysTranslationUpdatePayload"

/**
 * @summary The giveaways translations service.
 * @description This service is used to manage the giveaways translations.
 */
class GiveawaysTranslationsService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary Gets the giveaways translations count.
     * @description This method is used to get the giveaways translations count.
     * @param giveawayId The ID of the giveaway.
     * @returns The giveaways translations count.
     */
    public static async getGiveawayTranslationsCount(giveawayId: DatabaseIdentifier): Promise<number> {
        const cacheKey = `giveawayTranslationsCount:${giveawayId}`
        const cachedValue: number | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: number = await this.countEntriesInTable(
            giveawaysTranslationsTable,
            eq(giveawaysTranslationsTable.giveawayId, giveawayId),
        )
        await CacheClient.setValue(cacheKey, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the giveaways translations.
     * @description This method is used to get the giveaways translations.
     * @param giveawayId The ID of the giveaway.
     * @returns The giveaways translations.
     */
    private static async internalGetGiveawayTranslations(
        giveawayId: DatabaseIdentifier,
    ): Promise<IGiveawaysTranslation[]> {
        return await DatabaseClient.drizzleInstance
            .select()
            .from(giveawaysTranslationsTable)
            .where(eq(giveawaysTranslationsTable.giveawayId, giveawayId))
            .execute()
    }

    /**
     * @summary Gets the giveaways translations by page.
     * @description This method is used to get the giveaways translations by page.
     * @param page The page number.
     * @param giveawayId The ID of the giveaway.
     * @returns The giveaways translations by page.
     */
    public static async getGiveawayTranslationsByPage(
        page: number,
        giveawayId: DatabaseIdentifier,
    ): Promise<IGiveawaysTranslation[]> {
        const cacheKey = `giveawayTranslationsByPage:${giveawayId}:${page}`
        const cachedValue: IGiveawaysTranslation[] | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: IGiveawaysTranslation[] = await DatabaseClient.drizzleInstance
            .select()
            .from(giveawaysTranslationsTable)
            .where(eq(giveawaysTranslationsTable.giveawayId, giveawayId))
            .limit(this.PAGE_SIZE)
            .offset((page - 1) * this.PAGE_SIZE)
            .orderBy(desc(giveawaysTranslationsTable.language))
            .execute()

        await CacheClient.setValue(cacheKey, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the giveaways translation by ID.
     * @description This method is used to get the giveaways translation by ID.
     * @param id The ID of the giveaways translation.
     * @returns The giveaways translation or null if not found.
     */
    public static async getGiveawayTranslationById(id: DatabaseIdentifier): Promise<IGiveawaysTranslation | null> {
        const cacheKey = `giveawayTranslationById:${id}`
        const cachedValue: IGiveawaysTranslation | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IGiveawaysTranslation | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(giveawaysTranslationsTable)
                .where(eq(giveawaysTranslationsTable.id, id))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the giveaways translation by giveaway ID and language.
     * @description This method is used to get the giveaways translation by giveaway ID and language.
     * @param giveawayId The ID of the giveaway.
     * @param language The language of the giveaways translation.
     * @returns The giveaways translation or null if not found.
     */
    public static async getGiveawayTranslationByGiveawayIdAndLanguage(
        giveawayId: DatabaseIdentifier,
        language: Language,
    ): Promise<IGiveawaysTranslation | null> {
        const cacheKey = `giveawayTranslationByGiveawayIdAndLanguage:${giveawayId}:${language}`
        const cachedValue: IGiveawaysTranslation | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IGiveawaysTranslation | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(giveawaysTranslationsTable)
                .where(
                    and(
                        eq(giveawaysTranslationsTable.giveawayId, giveawayId),
                        eq(giveawaysTranslationsTable.language, language),
                    ),
                )
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates a giveaways translation.
     * @description This method is used to create a giveaways translation.
     * @param payload The payload of the giveaways translation.
     * @returns The giveaways translation or null if the creation failed.
     */
    public static async createGiveawayTranslation(
        payload: IGiveawaysTranslationCreatePayload,
    ): Promise<IGiveawaysTranslation | null> {
        if (await this.getGiveawayTranslationByGiveawayIdAndLanguage(payload.giveawayId, payload.language)) return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if ((await this.getGiveawayTranslationById(id)) === null) {
                const translation: IGiveawaysTranslation = this.resolveCreateElement({
                    id,
                    ...payload,
                })

                await DatabaseClient.drizzleInstance.insert(giveawaysTranslationsTable).values(translation).execute()
                await CacheClient.deleteValuesByPattern(
                    `giveawayTranslationsCount:${payload.giveawayId}`,
                    `giveawayTranslationsByPage:${payload.giveawayId}:*`,
                    `giveawayTranslationById:${id}`,
                    `giveawayTranslationByGiveawayIdAndLanguage:${payload.giveawayId}:${payload.language}`,
                )
                return translation
            }
        }

        return null
    }

    /**
     * @summary Updates a giveaways translation.
     * @description This method is used to update a giveaways translation.
     * @param id The ID of the giveaways translation.
     * @param payload The payload of the giveaways translation.
     * @returns The giveaways translation or null if the update failed.
     */
    public static async updateGiveawayTranslation(
        id: DatabaseIdentifier,
        payload: IGiveawaysTranslationUpdatePayload,
    ): Promise<IGiveawaysTranslation | null> {
        const giveawayTranslation: IGiveawaysTranslation | null = await this.getGiveawayTranslationById(id)
        if (giveawayTranslation === null) return null

        const updatedTranslation: IGiveawaysTranslation = this.resolveUpdateElement({
            ...giveawayTranslation,
            ...payload,
        })

        await DatabaseClient.drizzleInstance
            .update(giveawaysTranslationsTable)
            .set(updatedTranslation)
            .where(eq(giveawaysTranslationsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `giveawayTranslationsByPage:*`,
            `giveawayTranslationById:${id}`,
            `giveawayTranslationByGiveawayIdAndLanguage:${giveawayTranslation.giveawayId}:${giveawayTranslation.language}`,
        )
        return updatedTranslation
    }

    /**
     * @summary Deletes a giveaways translation by ID.
     * @description This method is used to delete a giveaways translation by ID.
     * @param id The ID of the giveaways translation.
     * @returns True if the deletion was successful, false otherwise.
     */
    public static async deleteGiveawayTranslationById(id: DatabaseIdentifier): Promise<boolean> {
        const giveawayTranslation: IGiveawaysTranslation | null = await this.getGiveawayTranslationById(id)
        if (giveawayTranslation === null) return false

        await DatabaseClient.drizzleInstance
            .delete(giveawaysTranslationsTable)
            .where(eq(giveawaysTranslationsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `giveawayTranslationsCount:${giveawayTranslation.giveawayId}`,
            `giveawayTranslationsByPage:${giveawayTranslation.giveawayId}:*`,
            `giveawayTranslationById:${id}`,
            `giveawayTranslationByGiveawayIdAndLanguage:${giveawayTranslation.giveawayId}:${giveawayTranslation.language}`,
        )
        return true
    }

    /**
     * @summary Deletes the giveaways translations by giveaway ID.
     * @description This method is used to delete the giveaways translations by giveaway ID.
     * @param giveawayId The ID of the giveaway.
     * @returns The number of deleted giveaways translations.
     */
    public static async deleteGiveawayTranslationsByGiveawayId(giveawayId: DatabaseIdentifier): Promise<number> {
        const giveawayTranslations: IGiveawaysTranslation[] = await this.internalGetGiveawayTranslations(giveawayId)
        if (giveawayTranslations.length === 0) return 0

        await DatabaseClient.drizzleInstance
            .delete(giveawaysTranslationsTable)
            .where(eq(giveawaysTranslationsTable.giveawayId, giveawayId))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `giveawayTranslationsCount:${giveawayId}`,
            `giveawayTranslationsByPage:${giveawayId}:*`,
            `giveawayTranslationByGiveawayIdAndLanguage:${giveawayId}:*`,
            ...giveawayTranslations.map(({ id }: IGiveawaysTranslation) => `giveawayTranslationById:${id}`),
        )
        return giveawayTranslations.length
    }
}

export { GiveawaysTranslationsService }
