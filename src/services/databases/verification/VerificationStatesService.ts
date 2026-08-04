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

    /**
     * @summary Sets the verification state.
     * @description This method is used to set the verification state.
     * @param guildId The ID of the guild to set the verification state for.
     * @param enabled Whether the verification is enabled.
     * @returns The verification state.
     */
    public static async setVerificationState(
        guildId: DiscordSnowflake,
        enabled: boolean,
    ): Promise<IVerificationState | null> {
        const verificationState: IVerificationState | null = await this.getVerificationStateByGuildId(guildId)
        if (verificationState === null) {
            for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
                const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
                if (await this.getVerificationStateById(id)) continue

                const verificationState: IVerificationState = this.resolveCreateElement({
                    id,
                    guildId,
                    enabled,
                })

                await DatabaseClient.drizzleInstance.insert(verificationStateTable).values(verificationState).execute()
                await CacheClient.deleteValues(`verificationStateById:${id}`, `verificationStateByGuildId:${guildId}`)
                return verificationState
            }

            return null
        }

        const updatedVerificationState: IVerificationState = this.resolveUpdateElement({
            ...verificationState,
            enabled,
        })

        await DatabaseClient.drizzleInstance
            .update(verificationStateTable)
            .set(updatedVerificationState)
            .where(eq(verificationStateTable.id, verificationState.id))
            .execute()
        await CacheClient.deleteValues(
            `verificationStateById:${verificationState.id}`,
            `verificationStateByGuildId:${guildId}`,
        )
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
