import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { announcementsTranslationsTable } from "@/oliverperzyk/globals/databases/DatabaseSchemas"
import { and, desc, eq } from "drizzle-orm"
import type { IAnnouncementsTranslation } from "@/oliverperzyk/models/services/databases/announcements/translations/interfaces/IAnnouncementsTranslation"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import { AnnouncementsTranslationsLanguage } from "@/oliverperzyk/models/services/databases/announcements/translations/enums/AnnouncementsTranslationsLanguage"
import type { IAnnouncementsTranslationCreatePayload } from "@/oliverperzyk/models/services/databases/announcements/translations/interfaces/IAnnouncementsTranslationCreatePayload"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"
import type { IAnnouncementsTranslationUpdatePayload } from "@/oliverperzyk/models/services/databases/announcements/translations/interfaces/IAnnouncementsTranslationUpdatePayload"

/**
 * @summary The announcements translations service.
 * @description This service is used to manage the announcements translations.
 */
class AnnouncementsTranslationsService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary Gets the count of announcements translations.
     * @description This method is used to get the count of announcements translations.
     * @param announcementId The ID of the announcement to get the count of translations for.
     * @returns The count of announcements translations.
     */
    public static async getAnnouncementsTranslationsCount(announcementId: DatabaseIdentifier): Promise<number> {
        const cacheKey = `announcementsTranslationsCount:${announcementId}`
        const cachedValue: number | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: number = await this.countEntriesInTable(
            announcementsTranslationsTable,
            eq(announcementsTranslationsTable.announcementId, announcementId),
        )
        await CacheClient.setValue(cacheKey, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the announcements translations.
     * @description This method is used to get the announcements translations.
     * @param announcementId The ID of the announcement to get the translations for.
     * @returns The announcements translations.
     */
    private static async internalGetAnnouncementsTranslations(
        announcementId: DatabaseIdentifier,
    ): Promise<IAnnouncementsTranslation[]> {
        return await DatabaseClient.drizzleInstance
            .select()
            .from(announcementsTranslationsTable)
            .where(eq(announcementsTranslationsTable.announcementId, announcementId))
            .execute()
    }

    /**
     * @summary Gets the announcements translations by page.
     * @description This method is used to get the announcements translations by page.
     * @param page The page number to get the translations for.
     * @param announcementId The ID of the announcement to get the translations for.
     * @returns The announcements translations by page.
     */
    public static async getAnnouncementsTranslationsByPage(
        page: number,
        announcementId: DatabaseIdentifier,
    ): Promise<IAnnouncementsTranslation[]> {
        const cacheKey = `announcementsTranslationsByPage:${announcementId}${page}`
        const cachedValue: IAnnouncementsTranslation[] | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: IAnnouncementsTranslation[] = await DatabaseClient.drizzleInstance
            .select()
            .from(announcementsTranslationsTable)
            .where(eq(announcementsTranslationsTable.announcementId, announcementId))
            .limit(10)
            .offset((page - 1) * 10)
            .orderBy(desc(announcementsTranslationsTable.language))
            .execute()

        await CacheClient.setValue(cacheKey, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the announcements translation by ID.
     * @description This method is used to get the announcements translation by ID.
     * @param id The ID of the announcement translation to get.
     * @returns The announcements translation by ID.
     */
    public static async getAnnouncementsTranslationById(
        id: DatabaseIdentifier,
    ): Promise<IAnnouncementsTranslation | null> {
        const cacheKey = `announcementsTranslationById:${id}`
        const cachedValue: IAnnouncementsTranslation | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IAnnouncementsTranslation | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(announcementsTranslationsTable)
                .where(eq(announcementsTranslationsTable.id, id))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the announcements translation by announcement ID and language.
     * @description This method is used to get the announcements translation by announcement ID and language.
     * @param announcementId The ID of the announcement to get the translation for.
     * @param language The language of the announcement translation to get.
     * @returns The announcements translation by announcement ID and language.
     */
    public static async getAnnouncementsTranslationByAnnouncementIdAndLanguage(
        announcementId: DatabaseIdentifier,
        language: AnnouncementsTranslationsLanguage,
    ): Promise<IAnnouncementsTranslation | null> {
        const cacheKey = `announcementsTranslationByAnnouncementIdAndLanguage:${announcementId}:${language}`
        const cachedValue: IAnnouncementsTranslation | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IAnnouncementsTranslation | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(announcementsTranslationsTable)
                .where(
                    and(
                        eq(announcementsTranslationsTable.announcementId, announcementId),
                        eq(announcementsTranslationsTable.language, language),
                    ),
                )
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates a new announcements translation.
     * @description This method is used to create a new announcements translation.
     * @param payload The payload of the announcements translation to create.
     * @returns The created announcements translation or null if the creation failed.
     */
    public static async createAnnouncementsTranslation(
        payload: IAnnouncementsTranslationCreatePayload,
    ): Promise<IAnnouncementsTranslation | null> {
        if (await this.getAnnouncementsTranslationByAnnouncementIdAndLanguage(payload.announcementId, payload.language))
            return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if ((await this.getAnnouncementsTranslationById(id)) === null) {
                const translation: IAnnouncementsTranslation = this.resolveCreateElement({
                    id,
                    ...payload,
                })

                await DatabaseClient.drizzleInstance
                    .insert(announcementsTranslationsTable)
                    .values(translation)
                    .execute()
                await CacheClient.deleteValuesByPattern(
                    `announcementsTranslationsCount:${payload.announcementId}`,
                    `announcementsTranslationsByPage:*`,
                    `announcementsTranslationById:${id}`,
                    `announcementsTranslationByAnnouncementIdAndLanguage:${payload.announcementId}:${payload.language}`,
                )
                return translation
            }
        }
        return null
    }

    /**
     * @summary Updates an announcements translation.
     * @description This method is used to update an announcements translation.
     * @param id The ID of the announcement translation to update.
     * @param payload The payload of the announcements translation to update.
     * @returns The updated announcements translation or null if the update failed.
     */
    public static async updateAnnouncementsTranslation(
        id: DatabaseIdentifier,
        payload: IAnnouncementsTranslationUpdatePayload,
    ): Promise<IAnnouncementsTranslation | null> {
        const announcementTranslation: IAnnouncementsTranslation | null = await this.getAnnouncementsTranslationById(id)
        if (announcementTranslation === null) return null

        const updatedTranslation: IAnnouncementsTranslation = this.resolveUpdateElement({
            ...announcementTranslation,
            ...payload,
        })

        await DatabaseClient.drizzleInstance
            .update(announcementsTranslationsTable)
            .set(updatedTranslation)
            .where(eq(announcementsTranslationsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `announcementsTranslationsCount:${announcementTranslation.announcementId}`,
            `announcementsTranslationsByPage:*`,
            `announcementsTranslationById:${id}`,
            `announcementsTranslationByAnnouncementIdAndLanguage:${announcementTranslation.announcementId}:${announcementTranslation.language}`,
        )
        return updatedTranslation
    }

    /**
     * @summary Deletes an announcements translation by ID.
     * @description This method is used to delete an announcements translation by ID.
     * @param id The ID of the announcement translation to delete.
     * @returns True if the announcements translation was deleted, false otherwise.
     */
    public static async deleteAnnouncementsTranslationById(id: DatabaseIdentifier): Promise<boolean> {
        const announcementTranslation: IAnnouncementsTranslation | null = await this.getAnnouncementsTranslationById(id)
        if (announcementTranslation === null) return false

        await DatabaseClient.drizzleInstance
            .delete(announcementsTranslationsTable)
            .where(eq(announcementsTranslationsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `announcementsTranslationsCount:${announcementTranslation.announcementId}`,
            `announcementsTranslationsByPage:*`,
            `announcementsTranslationById:${id}`,
            `announcementsTranslationByAnnouncementIdAndLanguage:${announcementTranslation.announcementId}:${announcementTranslation.language}`,
        )
        return true
    }

    /**
     * @summary Deletes the announcements translations by announcement ID.
     * @description This method is used to delete the announcements translations by announcement ID.
     * @param announcementId The ID of the announcement to delete the translations for.
     * @returns Count of deleted announcements translations.
     */
    public static async deleteAnnouncementsTranslationsByAnnouncementId(
        announcementId: DatabaseIdentifier,
    ): Promise<number> {
        if ((await this.getAnnouncementsTranslationsCount(announcementId)) === 0) return 0
        const announcementsTranslations: IAnnouncementsTranslation[] =
            await this.internalGetAnnouncementsTranslations(announcementId)
        await DatabaseClient.drizzleInstance
            .delete(announcementsTranslationsTable)
            .where(eq(announcementsTranslationsTable.announcementId, announcementId))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `announcementsTranslationsCount:${announcementId}`,
            `announcementsTranslationsByPage:*`,
            ...announcementsTranslations.flatMap(({ id, language }: IAnnouncementsTranslation): readonly string[] => [
                `announcementsTranslationById:${id}`,
                `announcementsTranslationByAnnouncementIdAndLanguage:${announcementId}:${language}`,
            ]),
        )

        return announcementsTranslations.length
    }
}

export { AnnouncementsTranslationsService }
