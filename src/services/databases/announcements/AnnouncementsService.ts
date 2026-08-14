import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { announcementsTable } from "@/oliverperzyk/globals/databases/DatabaseSchemas"
import { and, desc, eq } from "drizzle-orm"
import type { IAnnouncement } from "@/oliverperzyk/models/services/databases/announcements/base/interfaces/IAnnouncement"
import type { IAnnouncementPaginationFilterOptions } from "@/oliverperzyk/models/services/databases/announcements/base/interfaces/IAnnouncementPaginationFilterOptions"
import type { IPaginationResult } from "@/oliverperzyk/models/services/databases/base/interfaces/IPaginationResult"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import type { IAnnouncementCreatePayload } from "@/oliverperzyk/models/services/databases/announcements/base/interfaces/IAnnouncementCreatePayload"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"
import type { IAnnouncementUpdatePayload } from "@/oliverperzyk/models/services/databases/announcements/base/interfaces/IAnnouncementUpdatePayload"

/**
 * @summary Announcements service class.
 * @description This class is used to manage the announcements.
 */
class AnnouncementsService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary The cache key for the announcements count.
     * @description The cache key for the announcements count.
     */
    private static readonly ANNOUNCEMENTS_COUNT_CACHE_KEY: string = "announcementsCount"

    /**
     * @summary Gets the announcements count.
     * @description This method is used to get the announcements count.
     * @param guildId The guild ID.
     * @returns The announcements count.
     */
    public static async getAnnouncementsCount(guildId?: DiscordSnowflake): Promise<number> {
        if (guildId === undefined) {
            const cachedValue: number | null = await CacheClient.getValue(this.ANNOUNCEMENTS_COUNT_CACHE_KEY)
            if (cachedValue !== null) return cachedValue

            const queriedValue: number = await this.countEntriesInTable(announcementsTable)
            await CacheClient.setValue(this.ANNOUNCEMENTS_COUNT_CACHE_KEY, queriedValue)
            return queriedValue
        }

        const cacheKey: string = `announcementsCountByGuildId:${guildId}`
        const cachedValue: number | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: number = await this.countEntriesInTable(
            announcementsTable,
            eq(announcementsTable.guildId, guildId),
        )
        await CacheClient.setValue(cacheKey, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the announcements by page.
     * @description This method is used to get the announcements by page.
     * @param page The page number.
     * @param options The pagination filter options.
     * @returns The pagination result of the announcements.
     */
    public static async getAnnouncementsByPage(
        page: number,
        options?: IAnnouncementPaginationFilterOptions,
    ): Promise<IPaginationResult<IAnnouncement>> {
        const cacheKey: string = `announcementsByPage:${page}:${JSON.stringify(options)}`
        const cachedValue: IPaginationResult<IAnnouncement> | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: IAnnouncement[] = await DatabaseClient.drizzleInstance
            .select()
            .from(announcementsTable)
            .where(options?.guildId ? eq(announcementsTable.guildId, options.guildId) : undefined)
            .orderBy(desc(announcementsTable.createdAt))
            .offset((page - 1) * this.PAGE_SIZE)
            .limit(this.PAGE_SIZE)
            .execute()
        const result: IPaginationResult<IAnnouncement> = {
            items: queriedValue,
            totalCount: await this.getAnnouncementsCount(options?.guildId),
        }

        await CacheClient.setValue(cacheKey, result)
        return result
    }

    /**
     * @summary Gets the announcement by ID.
     * @description This method is used to get the announcement by ID.
     * @param id The ID of the announcement.
     * @returns The announcement by ID.
     */
    public static async getAnnouncementById(id: DatabaseIdentifier): Promise<IAnnouncement | null> {
        const cacheKey: string = `announcementById:${id}`
        const cachedValue: IAnnouncement | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IAnnouncement | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(announcementsTable)
                .where(eq(announcementsTable.id, id))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the announcement by guilds message.
     * @description This method is used to get the announcement by guilds message.
     * @param guildId The guild ID.
     * @param messageId The message ID.
     * @returns The announcement by guilds message.
     */
    public static async getAnnouncementByGuildsMessage(
        guildId: DiscordSnowflake,
        messageId: DiscordSnowflake,
    ): Promise<IAnnouncement | null> {
        const cacheKey: string = `announcementByGuildsMessage:${guildId}:${messageId}`
        const cachedValue: IAnnouncement | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IAnnouncement | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(announcementsTable)
                .where(and(eq(announcementsTable.guildId, guildId), eq(announcementsTable.messageId, messageId)))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates an announcement.
     * @description This method is used to create an announcement.
     * @param payload The payload of the announcement.
     * @returns The created announcement.
     */
    public static async createAnnouncement(payload: IAnnouncementCreatePayload): Promise<IAnnouncement | null> {
        if (await this.getAnnouncementByGuildsMessage(payload.guildId, payload.messageId)) return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if (await this.getAnnouncementById(id)) continue

            const announcement: IAnnouncement = this.resolveCreateElement({
                id,
                ...payload,
            })

            await DatabaseClient.drizzleInstance.insert(announcementsTable).values(announcement).execute()
            await CacheClient.deleteValuesByPattern(
                this.ANNOUNCEMENTS_COUNT_CACHE_KEY,
                `announcementsCountByGuildId:${payload.guildId}`,
                `announcementsByPage:*`,
                `announcementById:${id}`,
                `announcementByGuildsMessage:${payload.guildId}:${payload.messageId}`,
            )
            return announcement
        }

        return null
    }

    /**
     * @summary Updates an announcement.
     * @description This method is used to update an announcement.
     * @param id The ID of the announcement.
     * @param payload The payload of the announcement.
     * @returns The updated announcement.
     */
    public static async updateAnnouncement(
        id: DatabaseIdentifier,
        payload: IAnnouncementUpdatePayload,
    ): Promise<IAnnouncement | null> {
        const announcement: IAnnouncement | null = await this.getAnnouncementById(id)
        if (announcement === null) return null

        const updatedAnnouncement: IAnnouncement = this.resolveUpdateElement({
            ...announcement,
            ...payload,
        })

        await DatabaseClient.drizzleInstance
            .update(announcementsTable)
            .set(updatedAnnouncement)
            .where(eq(announcementsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            this.ANNOUNCEMENTS_COUNT_CACHE_KEY,
            `announcementsCountByGuildId:${announcement.guildId}`,
            `announcementsByPage:*`,
            `announcementById:${id}`,
            `announcementByGuildsMessage:${announcement.guildId}:${announcement.messageId}`,
        )
        return updatedAnnouncement
    }

    /**
     * @summary Deletes an announcement.
     * @description This method is used to delete an announcement.
     * @param id The ID of the announcement.
     * @returns True if the announcement was deleted, false otherwise.
     */
    public static async deleteAnnouncement(id: DatabaseIdentifier): Promise<boolean> {
        const announcement: IAnnouncement | null = await this.getAnnouncementById(id)
        if (announcement === null) return false

        await DatabaseClient.drizzleInstance.delete(announcementsTable).where(eq(announcementsTable.id, id)).execute()
        await CacheClient.deleteValuesByPattern(
            this.ANNOUNCEMENTS_COUNT_CACHE_KEY,
            `announcementsCountByGuildId:${announcement.guildId}`,
            `announcementsByPage:*`,
            `announcementById:${id}`,
            `announcementByGuildsMessage:${announcement.guildId}:${announcement.messageId}`,
        )
        return true
    }
}

export { AnnouncementsService }
