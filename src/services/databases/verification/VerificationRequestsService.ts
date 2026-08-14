import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { verificationRequestsTable } from "@/oliverperzyk/globals/databases/DatabaseSchemas"
import type { IVerificationRequest } from "@/oliverperzyk/models/services/databases/verification/requests/interfaces/IVerificationRequest"
import { VerificationRequestState } from "@/oliverperzyk/models/services/databases/verification/requests/enums/VerificationRequestState"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import { and, desc, eq } from "drizzle-orm"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { IVerificationRequestCreatePayload } from "@/oliverperzyk/models/services/databases/verification/requests/interfaces/IVerificationRequestCreatePayload"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"
import type { IVerificationRequestPaginationFilterOptions } from "@/oliverperzyk/models/services/databases/verification/requests/interfaces/IVerificationRequestPaginationFilterOptions"
import type { IVerificationRequestUpdatePayload } from "@/oliverperzyk/models/services/databases/verification/requests/interfaces/IVerificationRequestUpdatePayload"

/**
 * @summary Verification requests service class.
 * @description This class is used to manage the verification requests.
 */
class VerificationRequestsService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary The cache key for the verification requests count.
     * @description The cache key for the verification requests count.
     */
    private static readonly VERIFICATION_REQUESTS_COUNT_CACHE_KEY: string = "verificationRequestsCount"

    /**
     * @summary Gets the verification requests count.
     * @description This method is used to get the verification requests count.
     * @returns The verification requests count.
     */
    public static async getVerificationRequestsCount(): Promise<number> {
        const cachedValue: number | null = await CacheClient.getValue(this.VERIFICATION_REQUESTS_COUNT_CACHE_KEY)
        if (cachedValue !== null) return cachedValue

        const queriedValue: number = await this.countEntriesInTable(verificationRequestsTable)
        await CacheClient.setValue(this.VERIFICATION_REQUESTS_COUNT_CACHE_KEY, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the verification requests by page.
     * @description This method is used to get the verification requests by page.
     * @param page The page to get the verification requests by.
     * @param state The state of the verification requests to get.
     * @returns The verification requests by page.
     */
    public static async getVerificationRequestsByPage(
        page: number,
        options?: IVerificationRequestPaginationFilterOptions,
    ): Promise<IVerificationRequest[]> {
        const cacheKey: string = `verificationRequestsByPage:${page}:${JSON.stringify(options)}`
        const cachedValue: IVerificationRequest[] | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: IVerificationRequest[] = await DatabaseClient.drizzleInstance
            .select()
            .from(verificationRequestsTable)
            .where(
                and(
                    options?.state ? eq(verificationRequestsTable.state, options.state) : undefined,
                    options?.guildId ? eq(verificationRequestsTable.guildId, options.guildId) : undefined,
                    options?.userId ? eq(verificationRequestsTable.userId, options.userId) : undefined,
                ),
            )
            .orderBy(desc(verificationRequestsTable.createdAt))
            .offset((page - 1) * this.PAGE_SIZE)
            .limit(this.PAGE_SIZE)
            .execute()

        await CacheClient.setValue(cacheKey, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the verification request by ID.
     * @description This method is used to get the verification request by ID.
     * @param id The ID of the verification request to get.
     * @returns The verification request by ID.
     */
    public static async getVerificationRequestById(id: DatabaseIdentifier): Promise<IVerificationRequest | null> {
        const cacheKey: string = `verificationRequestById:${id}`
        const cachedValue: IVerificationRequest | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IVerificationRequest | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(verificationRequestsTable)
                .where(eq(verificationRequestsTable.id, id))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the verification request by user and guild.
     * @description This method is used to get the verification request by user and guild.
     * @param userId The ID of the user to get the verification request by.
     * @param guildId The ID of the guild to get the verification request by.
     * @returns The verification request by user and guild.
     */
    public static async getVerificationRequestByUserAndGuild(
        userId: DiscordSnowflake,
        guildId: DiscordSnowflake,
    ): Promise<IVerificationRequest | null> {
        const cacheKey: string = `verificationRequestByUserIdAndGuildId:${userId}:${guildId}`
        const cachedValue: IVerificationRequest | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IVerificationRequest | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(verificationRequestsTable)
                .where(
                    and(eq(verificationRequestsTable.userId, userId), eq(verificationRequestsTable.guildId, guildId)),
                )
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates a verification request.
     * @description This method is used to create a verification request.
     * @param payload The payload to create the verification request with.
     * @returns The created verification request.
     */
    public static async createVerificationRequest(
        payload: IVerificationRequestCreatePayload,
    ): Promise<IVerificationRequest | null> {
        if (await this.getVerificationRequestByUserAndGuild(payload.userId, payload.guildId)) return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if (await this.getVerificationRequestById(id)) continue

            const verificationRequest: IVerificationRequest = this.resolveCreateElement({
                id,
                userId: payload.userId,
                guildId: payload.guildId,
                comment: payload.comment,
                state: VerificationRequestState.UNOPENED,
            })

            await DatabaseClient.drizzleInstance.insert(verificationRequestsTable).values(verificationRequest).execute()
            await CacheClient.deleteValuesByPattern(
                this.VERIFICATION_REQUESTS_COUNT_CACHE_KEY,
                `verificationRequestsByPage:*`,
                `verificationRequestById:${id}`,
                `verificationRequestByUserIdAndGuildId:${payload.userId}:${payload.guildId}`,
            )

            return verificationRequest
        }

        return null
    }

    /**
     * @summary Updates a verification request.
     * @description This method is used to update a verification request.
     * @param id The ID of the verification request to update.
     * @param payload The payload to update the verification request with.
     * @returns The updated verification request.
     */
    public static async updateVerificationRequest(
        id: DatabaseIdentifier,
        payload: IVerificationRequestUpdatePayload,
    ): Promise<IVerificationRequest | null> {
        const verificationRequest: IVerificationRequest | null = await this.getVerificationRequestById(id)
        if (verificationRequest === null) return null

        const updatedVerificationRequest: IVerificationRequest = this.resolveUpdateElement({
            ...verificationRequest,
            ...payload,
        })

        await DatabaseClient.drizzleInstance
            .update(verificationRequestsTable)
            .set(updatedVerificationRequest)
            .where(eq(verificationRequestsTable.id, id))
            .execute()
        await CacheClient.deleteValues(
            this.VERIFICATION_REQUESTS_COUNT_CACHE_KEY,
            `verificationRequestsByPage:*`,
            `verificationRequestById:${id}`,
            `verificationRequestByUserIdAndGuildId:${verificationRequest.userId}:${verificationRequest.guildId}`,
        )

        return updatedVerificationRequest
    }

    /**
     * @summary Deletes a verification request.
     * @description This method is used to delete a verification request.
     * @param id The ID of the verification request to delete.
     * @returns True if the verification request was deleted, false otherwise.
     */
    public static async deleteVerificationRequest(id: DatabaseIdentifier): Promise<boolean> {
        const verificationRequest: IVerificationRequest | null = await this.getVerificationRequestById(id)
        if (verificationRequest === null) return false

        await DatabaseClient.drizzleInstance
            .delete(verificationRequestsTable)
            .where(eq(verificationRequestsTable.id, id))
            .execute()
        await CacheClient.deleteValues(
            this.VERIFICATION_REQUESTS_COUNT_CACHE_KEY,
            `verificationRequestsByPage:*`,
            `verificationRequestById:${id}`,
            `verificationRequestByUserIdAndGuildId:${verificationRequest.userId}:${verificationRequest.guildId}`,
        )

        return true
    }
}

export { VerificationRequestsService }
