import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { giveawaysParticipantsTable } from "@/oliverperzyk/globals/databases/DatabaseSchemas"
import { and, eq } from "drizzle-orm"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { IGiveawaysParticipant } from "@/oliverperzyk/models/services/databases/giveaways/participants/interfaces/IGiveawaysParticipant"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { IGiveawaysParticipantPaginationFilterOptions } from "@/oliverperzyk/models/services/databases/giveaways/participants/interfaces/IGiveawaysParticipantPaginationFilterOptions"
import type { IGiveawaysParticipantCreatePayload } from "@/oliverperzyk/models/services/databases/giveaways/participants/interfaces/IGiveawaysParticipantCreatePayload"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"
import type { IGiveawaysParticipantUpdatePayload } from "@/oliverperzyk/models/services/databases/giveaways/participants/interfaces/IGiveawaysParticipantUpdatePayload"

/**
 * @summary The giveaways participants service.
 * @description This service is used to manage the giveaways participants.
 */
class GiveawaysParticipantsService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary Gets the count of giveaways participants by giveaway ID.
     * @description This method is used to get the count of giveaways participants by giveaway ID.
     * @param giveawayId The ID of the giveaway to get the count of participants for.
     * @returns The count of giveaways participants.
     */
    public static async getGiveawaysParticipantsCountByGiveawayId(giveawayId: DatabaseIdentifier): Promise<number> {
        const cacheKey = `giveawaysParticipantsCountByGiveawayId:${giveawayId}`
        const cachedValue: number | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: number = await this.countEntriesInTable(
            giveawaysParticipantsTable,
            eq(giveawaysParticipantsTable.giveawayId, giveawayId),
        )
        await CacheClient.setValue(cacheKey, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the count of giveaways participants by user ID.
     * @description This method is used to get the count of giveaways participants by user ID.
     * @param userId The ID of the user to get the count of participants for.
     * @returns The count of giveaways participants.
     */
    public static async getGiveawaysParticipantsCountByUserId(userId: DiscordSnowflake): Promise<number> {
        const cacheKey = `giveawaysParticipantsCountByUserId:${userId}`
        const cachedValue: number | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: number = await this.countEntriesInTable(
            giveawaysParticipantsTable,
            eq(giveawaysParticipantsTable.userId, userId),
        )
        await CacheClient.setValue(cacheKey, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the giveaways participants by giveaway ID.
     * @description This method is used to get the giveaways participants by giveaway ID.
     * @param giveawayId The ID of the giveaway to get the participants for.
     * @returns The giveaways participants.
     */
    private static async internalGetGiveawaysParticipantsByGiveawayId(
        giveawayId: DatabaseIdentifier,
    ): Promise<IGiveawaysParticipant[]> {
        return await DatabaseClient.drizzleInstance
            .select()
            .from(giveawaysParticipantsTable)
            .where(eq(giveawaysParticipantsTable.giveawayId, giveawayId))
            .execute()
    }

    /**
     * @summary Gets the giveaways participants by user ID.
     * @description This method is used to get the giveaways participants by user ID.
     * @param userId The ID of the user to get the participants for.
     * @returns The giveaways participants.
     */
    private static async internalGetGiveawaysParticipantsByUserId(
        userId: DiscordSnowflake,
    ): Promise<IGiveawaysParticipant[]> {
        return await DatabaseClient.drizzleInstance
            .select()
            .from(giveawaysParticipantsTable)
            .where(eq(giveawaysParticipantsTable.userId, userId))
            .execute()
    }

    /**
     * @summary Gets the giveaways participants by page.
     * @description This method is used to get the giveaways participants by page.
     * @param page The page number to get the participants for.
     * @param options The options for the pagination.
     * @returns The giveaways participants.
     */
    public static async getGiveawaysParticipantsByPage(
        page: number,
        { giveawayId, ...options }: IGiveawaysParticipantPaginationFilterOptions,
    ): Promise<IGiveawaysParticipant[]> {
        const cacheKey = `giveawaysParticipantsByPage:${giveawayId}:${page}:${JSON.stringify(options)}`
        const cachedValue: IGiveawaysParticipant[] | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: IGiveawaysParticipant[] = await DatabaseClient.drizzleInstance
            .select()
            .from(giveawaysParticipantsTable)
            .where(
                and(
                    eq(giveawaysParticipantsTable.giveawayId, giveawayId),
                    options?.userId ? eq(giveawaysParticipantsTable.userId, options.userId) : undefined,
                    options?.isWinner ? eq(giveawaysParticipantsTable.isWinner, options.isWinner) : undefined,
                ),
            )
            .limit(this.PAGE_SIZE)
            .offset((page - 1) * this.PAGE_SIZE)
            .execute()

        await CacheClient.setValue(cacheKey, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the giveaways participant by ID.
     * @description This method is used to get the giveaways participant by ID.
     * @param id The ID of the participant to get.
     * @returns The giveaways participant.
     */
    public static async getGiveawayParticipantById(id: DatabaseIdentifier): Promise<IGiveawaysParticipant | null> {
        const cacheKey = `giveawayParticipantById:${id}`
        const cachedValue: IGiveawaysParticipant | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IGiveawaysParticipant | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(giveawaysParticipantsTable)
                .where(eq(giveawaysParticipantsTable.id, id))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the giveaways participant by entry.
     * @description This method is used to get the giveaways participant by entry.
     * @param giveawayId The ID of the giveaway to get the participant for.
     * @param userId The ID of the user to get the participant for.
     * @returns The giveaways participant.
     */
    public static async getGiveawayParticipantByEntry(
        giveawayId: DatabaseIdentifier,
        userId: DiscordSnowflake,
    ): Promise<IGiveawaysParticipant | null> {
        const cacheKey = `giveawayParticipantByEntry:${giveawayId}:${userId}`
        const cachedValue: IGiveawaysParticipant | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IGiveawaysParticipant | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(giveawaysParticipantsTable)
                .where(
                    and(
                        eq(giveawaysParticipantsTable.giveawayId, giveawayId),
                        eq(giveawaysParticipantsTable.userId, userId),
                    ),
                )
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates a giveaways participant.
     * @description This method is used to create a giveaways participant.
     * @param payload The payload for the giveaways participant.
     * @returns The giveaways participant.
     */
    public static async createGiveawayParticipant(
        payload: IGiveawaysParticipantCreatePayload,
    ): Promise<IGiveawaysParticipant | null> {
        if (await this.getGiveawayParticipantByEntry(payload.giveawayId, payload.userId)) return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if (await this.getGiveawayParticipantById(id)) continue
            const giveawayParticipant: IGiveawaysParticipant = this.resolveCreateElement({
                id,
                isWinner: false,
                ...payload,
            })

            await DatabaseClient.drizzleInstance
                .insert(giveawaysParticipantsTable)
                .values(giveawayParticipant)
                .execute()
            await CacheClient.deleteValuesByPattern(
                `giveawaysParticipantsCountByGiveawayId:${payload.giveawayId}`,
                `giveawaysParticipantsCountByUserId:${payload.userId}`,
                `giveawayParticipantById:${id}`,
                `giveawayParticipantByEntry:${payload.giveawayId}:${payload.userId}`,
                `giveawaysParticipantsByPage:${payload.giveawayId}:*`,
            )

            return giveawayParticipant
        }

        return null
    }

    /**
     * @summary Updates a giveaways participant.
     * @description This method is used to update a giveaways participant.
     * @param id The ID of the participant to update.
     * @param payload The payload for the giveaways participant.
     * @returns The giveaways participant.
     */
    public static async updateGiveawayParticipant(
        id: DatabaseIdentifier,
        payload: IGiveawaysParticipantUpdatePayload,
    ): Promise<IGiveawaysParticipant | null> {
        const giveawayParticipant: IGiveawaysParticipant | null = await this.getGiveawayParticipantById(id)
        if (!giveawayParticipant) return null

        const updatedGiveawayParticipant: IGiveawaysParticipant = this.resolveUpdateElement({
            ...giveawayParticipant,
            ...payload,
        })

        await DatabaseClient.drizzleInstance
            .update(giveawaysParticipantsTable)
            .set(updatedGiveawayParticipant)
            .where(eq(giveawaysParticipantsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `giveawayParticipantById:${id}`,
            `giveawayParticipantByEntry:${giveawayParticipant.giveawayId}:${giveawayParticipant.userId}`,
            `giveawaysParticipantsByPage:${giveawayParticipant.giveawayId}:*`,
        )
        return updatedGiveawayParticipant
    }

    /**
     * @summary Deletes a giveaways participant by ID.
     * @description This method is used to delete a giveaways participant by ID.
     * @param id The ID of the participant to delete.
     * @returns True if the participant was deleted, false otherwise.
     */
    public static async deleteGiveawayParticipantById(id: DatabaseIdentifier): Promise<boolean> {
        const giveawayParticipant: IGiveawaysParticipant | null = await this.getGiveawayParticipantById(id)
        if (!giveawayParticipant) return false

        await DatabaseClient.drizzleInstance
            .delete(giveawaysParticipantsTable)
            .where(eq(giveawaysParticipantsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `giveawaysParticipantsCountByGiveawayId:${giveawayParticipant.giveawayId}`,
            `giveawaysParticipantsCountByUserId:${giveawayParticipant.userId}`,
            `giveawaysParticipantsByPage:${giveawayParticipant.giveawayId}:*`,
            `giveawayParticipantById:${id}`,
            `giveawayParticipantByEntry:${giveawayParticipant.giveawayId}:${giveawayParticipant.userId}`,
        )
        return true
    }

    /**
     * @summary Deletes giveaways participants by giveaway ID.
     * @description This method is used to delete giveaways participants by giveaway ID.
     * @param giveawayId The ID of the giveaway to delete the participants for.
     * @returns The number of participants deleted.
     */
    public static async deleteGiveawaysParticipantsByGiveawayId(giveawayId: DatabaseIdentifier): Promise<number> {
        const giveawaysParticipantsCount: number = await this.getGiveawaysParticipantsCountByGiveawayId(giveawayId)
        if (giveawaysParticipantsCount === 0) return 0
        const giveawayParticipants: IGiveawaysParticipant[] =
            await this.internalGetGiveawaysParticipantsByGiveawayId(giveawayId)
        await DatabaseClient.drizzleInstance
            .delete(giveawaysParticipantsTable)
            .where(eq(giveawaysParticipantsTable.giveawayId, giveawayId))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `giveawaysParticipantsCountByGiveawayId:${giveawayId}`,
            `giveawaysParticipantsByPage:${giveawayId}:*`,
            ...giveawayParticipants.flatMap(({ id, userId }: IGiveawaysParticipant): readonly string[] => [
                `giveawaysParticipantsCountByUserId:${userId}`,
                `giveawayParticipantByEntry:${giveawayId}:${userId}`,
                `giveawayParticipantById:${id}`,
            ]),
        )
        return giveawaysParticipantsCount
    }

    /**
     * @summary Deletes giveaways participants by user ID.
     * @description This method is used to delete giveaways participants by user ID.
     * @param userId The ID of the user to delete the participants for.
     * @returns The number of participants deleted.
     */
    public static async deleteGiveawaysParticipantsByUserId(userId: DiscordSnowflake): Promise<number> {
        const giveawaysParticipantsCount: number = await this.getGiveawaysParticipantsCountByUserId(userId)
        if (giveawaysParticipantsCount === 0) return 0
        const giveawayParticipants: IGiveawaysParticipant[] =
            await this.internalGetGiveawaysParticipantsByUserId(userId)
        await DatabaseClient.drizzleInstance
            .delete(giveawaysParticipantsTable)
            .where(eq(giveawaysParticipantsTable.userId, userId))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `giveawaysParticipantsCountByUserId:${userId}`,
            ...giveawayParticipants.flatMap(({ id, giveawayId }: IGiveawaysParticipant): readonly string[] => [
                `giveawaysParticipantsCountByGiveawayId:${giveawayId}`,
                `giveawayParticipantByEntry:${giveawayId}:${userId}`,
                `giveawayParticipantById:${id}`,
                `giveawaysParticipantsByPage:${giveawayId}:*`,
            ]),
        )
        return giveawaysParticipantsCount
    }
}

export { GiveawaysParticipantsService }
