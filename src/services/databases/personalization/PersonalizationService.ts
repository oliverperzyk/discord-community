import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import type { IPersonalization } from "@/oliverperzyk/models/services/databases/personalization/languages/interfaces/IPersonalization"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import { personalizationTable } from "@/oliverperzyk/globals/databases/DatabaseSchemas"
import { eq } from "drizzle-orm"
import type { IPersonalizationUpsertPayload } from "@/oliverperzyk/models/services/databases/personalization/languages/interfaces/IPersonalizationUpsertPayload"

/**
 * @summary The personalization service.
 * @description This service is used to manage the personalization.
 */
class PersonalizationService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary The default personalization.
     * @description The default personalization settings.
     */
    public static readonly DEFAULT_SETTINGS: Readonly<Omit<IPersonalization, "id" | "createdAt" | "updatedAt">> = {
        language: Language.ENGLISH,
    }

    /**
     * @summary Gets the personalization by user ID.
     * @description This method is used to get the personalization by user ID.
     * @param userId The ID of the user.
     * @returns The personalization.
     */
    public static async getPersonalizationByUserId(userId: DiscordSnowflake): Promise<IPersonalization | null> {
        const cacheKey: string = `personalizationByUserId:${userId}`
        const cachedValue: IPersonalization | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: IPersonalization | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(personalizationTable)
                .where(eq(personalizationTable.id, userId))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Upserts the user's personalization settings.
     * @description This method is used to upsert (create/update) the user's personalization settings.
     * @param userId The ID of the user.
     * @param payload The payload for the personalization settings.
     * @returns The personalization settings.
     */
    public static async upsertPersonalization(
        userId: DiscordSnowflake,
        payload: IPersonalizationUpsertPayload,
    ): Promise<IPersonalization> {
        const personalization: IPersonalization | null = await this.getPersonalizationByUserId(userId)
        if (personalization === null) {
            const newPersonalization: IPersonalization = this.resolveCreateElement({
                id: userId,
                ...this.DEFAULT_SETTINGS,
                ...payload,
            })

            await DatabaseClient.drizzleInstance.insert(personalizationTable).values(newPersonalization).execute()
            await CacheClient.deleteValues(`personalizationByUserId:${userId}`)
            return newPersonalization
        } else {
            const updatedPersonalization: IPersonalization = this.resolveUpdateElement({
                ...personalization,
                ...payload,
            })

            await DatabaseClient.drizzleInstance
                .update(personalizationTable)
                .set(updatedPersonalization)
                .where(eq(personalizationTable.id, userId))
                .execute()
            await CacheClient.deleteValues(`personalizationByUserId:${userId}`)
            return updatedPersonalization
        }
    }
}

export { PersonalizationService }
