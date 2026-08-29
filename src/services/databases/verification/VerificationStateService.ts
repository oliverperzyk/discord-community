import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import type { IVerificationState } from "@/oliverperzyk/models/services/databases/verification/state/interfaces/IVerificationState"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { verificationStateTable } from "@/oliverperzyk/globals/databases/verification/VerificationStateSchemas"
import { eq } from "drizzle-orm"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"
import type { IVerificationStateCreatePayload } from "@/oliverperzyk/models/services/databases/verification/state/interfaces/IVerificationStateCreatePayload"
import type { IVerificationStateUpdatePayload } from "@/oliverperzyk/models/services/databases/verification/state/interfaces/IVerificationStateUpdatePayload"

/**
 * @summary Verification states service class.
 * @description This class is used to manage the verification states.
 */
class VerificationStateService extends BaseDatabaseService {
    /**
     * @summary Protected constructor.
     * @description Protected constructor to prevent instantiation, while allowing inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary Gets all verification states.
     * @description This method is used to get all verification states.
     * @returns All verification states.
     * @remarks This method does not need to be cached or paginated, as the table won't have more than 10 rows.
     */
    public static async getAllVerificationStates(): Promise<IVerificationState[]> {
        return await DatabaseClient.drizzleInstance.select().from(verificationStateTable)
    }

    /**
     * @summary Gets the verification state by ID.
     * @description This method is used to get the verification state by ID.
     * @param id The ID of the verification state to get.
     * @returns The verification state by ID.
     */
    public static async getVerificationStateById(id: DatabaseIdentifier): Promise<IVerificationState | null> {
        const cacheKey: string = `verificationStateById:${id}`
        const cachedValue: IVerificationState | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IVerificationState | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(verificationStateTable)
                .where(eq(verificationStateTable.id, id))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    public static async getVerificationStateByGuildId(guildId: DiscordSnowflake): Promise<IVerificationState | null> {
        const cacheKey: string = `verificationStateByGuildId:${guildId}`
        const cachedValue: IVerificationState | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IVerificationState | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(verificationStateTable)
                .where(eq(verificationStateTable.guildId, guildId))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    public static async createVerificationState(
        payload: IVerificationStateCreatePayload,
    ): Promise<IVerificationState | null> {
        if (await this.getVerificationStateByGuildId(payload.guildId)) return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if (await this.getVerificationStateById(id)) continue

            const verificationState: IVerificationState | null = this.resolveCreateElement({
                id,
                ...payload,
            })

            await DatabaseClient.drizzleInstance.insert(verificationStateTable).values(verificationState).execute()
            await CacheClient.deleteValues(
                `verificationStateById:${id}`,
                `verificationStateByGuildId:${payload.guildId}`,
            )
            return verificationState
        }

        return null
    }

    /**
     * @summary Updates the verification state by ID.
     * @description This method is used to update the verification state by ID.
     * @param id The ID of the verification state to update.
     * @param payload The payload for updating the verification state.
     * @returns The updated verification state.
     */
    public static async updateVerificationStateById(
        id: DatabaseIdentifier,
        payload: IVerificationStateUpdatePayload,
    ): Promise<IVerificationState | null> {
        const verificationState: IVerificationState | null = await this.getVerificationStateById(id)
        if (verificationState === null) return null

        const updatedVerificationState: IVerificationState = this.resolveUpdateElement({
            ...verificationState,
            ...payload,
        })

        await DatabaseClient.drizzleInstance
            .update(verificationStateTable)
            .set(updatedVerificationState)
            .where(eq(verificationStateTable.id, id))
            .execute()
        await CacheClient.deleteValues(
            `verificationStateById:${id}`,
            `verificationStateByGuildId:${verificationState.guildId}`,
        )
        return updatedVerificationState
    }

    /**
     * @summary Updates the verification state by guild ID.
     * @description This method is used to update the verification state by guild ID.
     * @param guildId The ID of the guild to update the verification state for.
     * @param payload The payload for updating the verification state.
     * @returns The updated verification state.
     */
    public static async updateVerificationStateByGuildId(
        guildId: DiscordSnowflake,
        payload: IVerificationStateUpdatePayload,
    ): Promise<IVerificationState | null> {
        const verificationState: IVerificationState | null = await this.getVerificationStateByGuildId(guildId)
        if (verificationState === null) return null

        const updatedVerificationState: IVerificationState = this.resolveUpdateElement({
            ...verificationState,
            ...payload,
        })

        await DatabaseClient.drizzleInstance
            .update(verificationStateTable)
            .set(updatedVerificationState)
            .where(eq(verificationStateTable.guildId, guildId))
            .execute()
        await CacheClient.deleteValues(`verificationStateByGuildId:${guildId}`)
        return updatedVerificationState
    }

    /**
     * @summary Deletes the verification state.
     * @description This method is used to delete the verification state.
     * @param id The ID of the verification state to delete.
     * @returns True if the verification state was deleted, false otherwise.
     */
    public static async deleteVerificationState(id: DatabaseIdentifier): Promise<boolean> {
        const verificationState: IVerificationState | null = await this.getVerificationStateById(id)
        if (verificationState === null) return false

        await DatabaseClient.drizzleInstance
            .delete(verificationStateTable)
            .where(eq(verificationStateTable.id, id))
            .execute()
        await CacheClient.deleteValues(`verificationStateById:${id}`)
        return true
    }
}

export { VerificationStateService }
