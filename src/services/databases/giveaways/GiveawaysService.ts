import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { giveawaysTable } from "@/oliverperzyk/globals/databases/DatabaseSchemas"
import type { IGiveaway } from "@/oliverperzyk/models/services/databases/giveaways/base/interfaces/IGiveaway"
import type { IGiveawayPaginationFilterOptions } from "@/oliverperzyk/models/services/databases/giveaways/base/interfaces/IGiveawayPaginationFilterOptions"
import { and, desc, eq } from "drizzle-orm"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { IGivewayCreatePayload } from "@/oliverperzyk/models/services/databases/giveaways/base/interfaces/IGivewayCreatePayload"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"
import type { IGivewayUpdatePayload } from "@/oliverperzyk/models/services/databases/giveaways/base/interfaces/IGivewayUpdatePayload"

/**
 * @summary The giveaways service.
 * @description This service is used to manage the giveaways.
 */
class GiveawaysService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary The cache key for the giveaways count.
     * @description The cache key for the giveaways count.
     */
    private static readonly GIVEAWAYS_COUNT_CACHE_KEY: string = "giveawaysCount"

    /**
     * @summary Gets the giveaways count.
     * @description This method is used to get the giveaways count.
     * @returns The giveaways count.
     */
    public static async getGiveawaysCount(): Promise<number> {
        const cachedValue: number | null = await CacheClient.getValue(this.GIVEAWAYS_COUNT_CACHE_KEY)
        if (cachedValue !== null) return cachedValue
        const queriedValue: number = await this.countEntriesInTable(giveawaysTable)
        await CacheClient.setValue(this.GIVEAWAYS_COUNT_CACHE_KEY, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the giveaways by page.
     * @description This method is used to get the giveaways by page.
     * @param page The page number.
     * @param options The options for the giveaways.
     * @returns The giveaways by page.
     */
    public static async getGiveawaysByPage(
        page: number,
        options?: IGiveawayPaginationFilterOptions,
    ): Promise<IGiveaway[]> {
        const cacheKey: string = `giveawaysByPage:${page}`
        const cachedValue: IGiveaway[] | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValues: IGiveaway[] = await DatabaseClient.drizzleInstance
            .select()
            .from(giveawaysTable)
            .where(options?.guildId === undefined ? undefined : eq(giveawaysTable.guildId, options.guildId))
            .limit(this.PAGE_SIZE)
            .offset((page - 1) * this.PAGE_SIZE)
            .orderBy(desc(giveawaysTable.createdAt))
            .execute()
        await CacheClient.setValue(cacheKey, queriedValues)
        return queriedValues
    }

    /**
     * @summary Gets the giveaway by ID.
     * @description This method is used to get the giveaway by ID.
     * @param id The ID of the giveaway.
     * @returns The giveaway by ID.
     */
    public static async getGiveawayById(id: DatabaseIdentifier): Promise<IGiveaway | null> {
        const cacheKey: string = `giveawayById:${id}`
        const cachedValue: IGiveaway | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IGiveaway | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(giveawaysTable)
                .where(eq(giveawaysTable.id, id))
                .execute(),
        )
        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the giveaway by message.
     * @description This method is used to get the giveaway by message.
     * @param guildId The ID of the guild.
     * @param messageId The ID of the message.
     * @returns The giveaway by message.
     */
    public static async getGiveawayByMessage(
        guildId: DiscordSnowflake,
        messageId: DiscordSnowflake,
    ): Promise<IGiveaway | null> {
        const cacheKey: string = `giveawayByMessage:${guildId}:${messageId}`
        const cachedValue: IGiveaway | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IGiveaway | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(giveawaysTable)
                .where(and(eq(giveawaysTable.guildId, guildId), eq(giveawaysTable.messageId, messageId)))
                .execute(),
        )
        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates a giveaway.
     * @description This method is used to create a giveaway.
     * @param payload The payload for the giveaway.
     * @returns The created giveaway.
     */
    public static async createGiveaway(payload: IGivewayCreatePayload): Promise<IGiveaway | null> {
        if (payload.messageId && (await this.getGiveawayByMessage(payload.guildId, payload.messageId))) return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = await DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if (await this.getGiveawayById(id)) continue

            const giveaway: IGiveaway = this.resolveCreateElement({
                id,
                ...payload,
                alreadyRolled: false,
                messageId: payload.messageId ?? null,
                additionalInformation: payload.additionalInformation ?? null,
            })

            await DatabaseClient.drizzleInstance.insert(giveawaysTable).values(giveaway).execute()
            await CacheClient.deleteValuesByPattern(
                this.GIVEAWAYS_COUNT_CACHE_KEY,
                `giveawaysByPage:*`,
                `giveawayById:${id}`,
                `giveawayByMessage:${payload.guildId}:${payload.messageId}`,
            )
            return giveaway
        }

        return null
    }

    /**
     * @summary Updates a giveaway.
     * @description This method is used to update a giveaway.
     * @param id The ID of the giveaway.
     * @param payload The payload for the giveaway.
     * @returns The updated giveaway.
     */
    public static async updateGiveaway(
        id: DatabaseIdentifier,
        payload: IGivewayUpdatePayload,
    ): Promise<IGiveaway | null> {
        const giveaway: IGiveaway | null = await this.getGiveawayById(id)
        if (giveaway === null) return null

        const updatedGiveaway: IGiveaway = this.resolveUpdateElement({
            ...giveaway,
            ...payload,
        })

        await DatabaseClient.drizzleInstance
            .update(giveawaysTable)
            .set(updatedGiveaway)
            .where(eq(giveawaysTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            this.GIVEAWAYS_COUNT_CACHE_KEY,
            `giveawaysByPage:*`,
            `giveawayById:${id}`,
            `giveawayByMessage:${giveaway.guildId}:${giveaway.messageId}`,
        )
        return updatedGiveaway
    }

    /**
     * @summary Deletes a giveaway by ID.
     * @description This method is used to delete a giveaway by ID.
     * @param id The ID of the giveaway.
     * @returns True if the giveaway was deleted, false otherwise.
     */
    public static async deleteGiveawayById(id: DatabaseIdentifier): Promise<boolean> {
        const giveaway: IGiveaway | null = await this.getGiveawayById(id)
        if (giveaway === null) return false

        await DatabaseClient.drizzleInstance.delete(giveawaysTable).where(eq(giveawaysTable.id, id)).execute()
        await CacheClient.deleteValuesByPattern(
            this.GIVEAWAYS_COUNT_CACHE_KEY,
            `giveawaysByPage:*`,
            `giveawayById:${id}`,
            `giveawayByMessage:${giveaway.guildId}:${giveaway.messageId}`,
        )
        return true
    }
}

export { GiveawaysService }
