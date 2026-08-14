import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { moderatorsPunishmentsTable } from "@/oliverperzyk/globals/databases/DatabaseSchemas"
import type { IPaginationResult } from "@/oliverperzyk/models/services/databases/base/interfaces/IPaginationResult"
import type { IModeratorsPunishment } from "@/oliverperzyk/models/services/databases/moderator/punishments/interfaces/IModeratorsPunishment"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import { and, desc, eq, type SQL } from "drizzle-orm"
import type { IModeratorsPunishmentPaginationFilterOptions } from "@/oliverperzyk/models/services/databases/moderator/punishments/interfaces/IModeratorsPunishmentPaginationFilterOptions"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import type { IModeratorsPunishmentCreatePayload } from "@/oliverperzyk/models/services/databases/moderator/punishments/interfaces/IModeratorsPunishmentCreatePayload"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"
import type { IModeratorsPunishmentUpdatePayload } from "@/oliverperzyk/models/services/databases/moderator/punishments/interfaces/IModeratorsPunishmentUpdatePayload"

/**
 * @summary The moderators punishments service.
 * @description This service is used to manage the moderators punishments.
 */
class ModeratorsPunishmentsService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary The cache key for the moderators punishments count.
     * @description The cache key for the moderators punishments count.
     */
    private static readonly MODERATORS_PUNISHMENTS_COUNT_CACHE_KEY: string = "moderatorsPunishmentsCount"

    /**
     * @summary Gets the moderators punishments count.
     * @description This method is used to get the moderators punishments count.
     * @returns The moderators punishments count.
     */
    public static async getModeratorsPunishmentsCount(): Promise<number> {
        const cachedValue: number | null = await CacheClient.getValue(this.MODERATORS_PUNISHMENTS_COUNT_CACHE_KEY)
        if (cachedValue !== null) return cachedValue

        const queriedValue: number = await this.countEntriesInTable(moderatorsPunishmentsTable)
        await CacheClient.setValue(this.MODERATORS_PUNISHMENTS_COUNT_CACHE_KEY, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the moderators punishments by page.
     * @description This method is used to get the moderators punishments by page.
     * @param page The page number.
     * @param options The pagination filter options.
     * @returns The moderators punishments by page.
     */
    public static async getModeratorsPunishmentsByPage(
        page: number,
        options?: IModeratorsPunishmentPaginationFilterOptions,
    ): Promise<IPaginationResult<IModeratorsPunishment>> {
        const cacheKey: string = `moderatorsPunishmentsByPage:${page}:${JSON.stringify(options)}`
        const cachedValue: IPaginationResult<IModeratorsPunishment> | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const where: SQL | undefined = and(
            options?.guildId ? eq(moderatorsPunishmentsTable.guildId, options.guildId) : undefined,
            options?.userId ? eq(moderatorsPunishmentsTable.userId, options.userId) : undefined,
            options?.type ? eq(moderatorsPunishmentsTable.type, options.type) : undefined,
        )
        const queriedValues: IModeratorsPunishment[] = await DatabaseClient.drizzleInstance
            .select()
            .from(moderatorsPunishmentsTable)
            .where(where)
            .orderBy(desc(moderatorsPunishmentsTable.createdAt))
            .offset((page - 1) * this.PAGE_SIZE)
            .limit(this.PAGE_SIZE)
            .execute()

        const result: IPaginationResult<IModeratorsPunishment> = {
            items: queriedValues,
            totalCount: await this.countEntriesInTable(moderatorsPunishmentsTable, where),
        }

        await CacheClient.setValue(cacheKey, result)
        return result
    }

    /**
     * @summary Gets the moderators punishment by ID.
     * @description This method is used to get the moderators punishment by ID.
     * @param id The ID of the moderators punishment.
     * @returns The moderators punishment.
     */
    public static async getModeratorsPunishmentById(id: DatabaseIdentifier): Promise<IModeratorsPunishment | null> {
        const cacheKey: string = `moderatorsPunishmentById:${id}`
        const cachedValue: IModeratorsPunishment | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: IModeratorsPunishment | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(moderatorsPunishmentsTable)
                .where(eq(moderatorsPunishmentsTable.id, id))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates a moderators punishment.
     * @description This method is used to create a moderators punishment.
     * @param payload The payload for the moderators punishment.
     * @returns The moderators punishment.
     */
    public static async createModeratorsPunishment(
        payload: IModeratorsPunishmentCreatePayload,
    ): Promise<IModeratorsPunishment | null> {
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if (await this.getModeratorsPunishmentById(id)) continue

            const moderatorsPunishment: IModeratorsPunishment = this.resolveCreateElement({
                id,
                ...payload,
                expiresAt: payload.expiresAt ?? null,
            })

            await DatabaseClient.drizzleInstance
                .insert(moderatorsPunishmentsTable)
                .values(moderatorsPunishment)
                .execute()
            await CacheClient.deleteValuesByPattern(
                this.MODERATORS_PUNISHMENTS_COUNT_CACHE_KEY,
                `moderatorsPunishmentsByPage:*`,
                `moderatorsPunishmentById:${id}`,
            )
            return moderatorsPunishment
        }

        return null
    }

    /**
     * @summary Updates a moderators punishment.
     * @description This method is used to update a moderators punishment.
     * @param id The ID of the moderators punishment.
     * @param payload The payload for the moderators punishment.
     * @returns The moderators punishment.
     */
    public static async updateModeratorsPunishment(
        id: DatabaseIdentifier,
        payload: IModeratorsPunishmentUpdatePayload,
    ): Promise<IModeratorsPunishment | null> {
        const moderatorsPunishment: IModeratorsPunishment | null = await this.getModeratorsPunishmentById(id)
        if (moderatorsPunishment === null) return null
        const updatedModeratorsPunishment: IModeratorsPunishment = this.resolveUpdateElement({
            ...moderatorsPunishment,
            ...payload,
            expiresAt: payload.expiresAt ?? null,
        })
        await DatabaseClient.drizzleInstance
            .update(moderatorsPunishmentsTable)
            .set(updatedModeratorsPunishment)
            .where(eq(moderatorsPunishmentsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            this.MODERATORS_PUNISHMENTS_COUNT_CACHE_KEY,
            `moderatorsPunishmentsByPage:*`,
            `moderatorsPunishmentById:${id}`,
        )
        return updatedModeratorsPunishment
    }

    /**
     * @summary Deletes a moderators punishment by ID.
     * @description This method is used to delete a moderators punishment by ID.
     * @param id The ID of the moderators punishment.
     * @returns True if the moderators punishment was deleted, false otherwise.
     */
    public static async deleteModeratorsPunishmentById(id: DatabaseIdentifier): Promise<boolean> {
        const moderatorsPunishment: IModeratorsPunishment | null = await this.getModeratorsPunishmentById(id)
        if (moderatorsPunishment === null) return false
        await DatabaseClient.drizzleInstance
            .delete(moderatorsPunishmentsTable)
            .where(eq(moderatorsPunishmentsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            this.MODERATORS_PUNISHMENTS_COUNT_CACHE_KEY,
            `moderatorsPunishmentsByPage:*`,
            `moderatorsPunishmentById:${id}`,
        )
        return true
    }
}

export { ModeratorsPunishmentsService }
