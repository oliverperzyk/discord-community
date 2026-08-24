import { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { ticketsParticipantsTable } from "@/oliverperzyk/globals/databases/tickets/TicketsParticipantsSchemas"
import { and, eq } from "drizzle-orm"
import type { ITicketParticipant } from "@/oliverperzyk/models/services/databases/tickets/participants/interfaces/ITicketParticipant"
import type { IPaginationResult } from "@/oliverperzyk/models/services/databases/base/interfaces/IPaginationResult"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { NotFoundCacheFlag } from "@/oliverperzyk/models/services/databases/base/types/NotFoundCacheFlag"
import type { ITicketParticipantCreatePayload } from "@/oliverperzyk/models/services/databases/tickets/participants/interfaces/ITicketParticipantCreatePayload"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"

/**
 * @summary The tickets participants service.
 * @description This service is used to manage the tickets participants.
 */
class TicketsParticipantsService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary Gets the participants count.
     * @description This method is used to get the participants count.
     * @param ticketId The ID of the ticket to get the participants count for.
     * @returns The participants count.
     */
    public static async getParticipantsCount(ticketId: DatabaseIdentifier): Promise<number> {
        const cacheKey: string = `ticketsParticipantsCount:${ticketId}`
        const cachedValue: number | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue
        const participantsCount: number = await this.countEntriesInTable(
            ticketsParticipantsTable,
            eq(ticketsParticipantsTable.ticketId, ticketId),
        )
        await CacheClient.setValue(cacheKey, participantsCount)
        return participantsCount
    }

    /**
     * @summary Gets the participants by ticket ID.
     * @description This method is used to get the participants by ticket ID, used by delete methods.
     * @param ticketId The ID of the ticket to get the participants by.
     * @returns The participants by ticket ID.
     */
    private static async internalGetParticipantsByTicketId(
        ticketId: DatabaseIdentifier,
    ): Promise<ITicketParticipant[]> {
        return await DatabaseClient.drizzleInstance
            .select()
            .from(ticketsParticipantsTable)
            .where(eq(ticketsParticipantsTable.ticketId, ticketId))
            .execute()
    }

    /**
     * @summary Gets the participants by ticket ID and page.
     * @description This method is used to get the participants by ticket ID and page.
     * @param page The page number.
     * @param ticketId The ID of the ticket to get the participants by.
     * @returns The participants by ticket ID and page.
     */
    public static async getParticipantsByTicketId(
        page: number,
        ticketId: DatabaseIdentifier,
    ): Promise<IPaginationResult<ITicketParticipant>> {
        const cacheKey: string = `ticketsParticipantsByTicketId:${ticketId}:${page}`
        const cachedValue: IPaginationResult<ITicketParticipant> | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue
        const participants: ITicketParticipant[] = await DatabaseClient.drizzleInstance
            .select()
            .from(ticketsParticipantsTable)
            .where(eq(ticketsParticipantsTable.ticketId, ticketId))
            .limit(this.PAGE_SIZE)
            .offset((page - 1) * this.PAGE_SIZE)
            .execute()
        const result: IPaginationResult<ITicketParticipant> = {
            items: participants,
            totalCount: await this.countEntriesInTable(
                ticketsParticipantsTable,
                eq(ticketsParticipantsTable.ticketId, ticketId),
            ),
        }

        await CacheClient.setValue(cacheKey, result)
        return result
    }

    /**
     * @summary Gets the participant by ID.
     * @description This method is used to get the participant by ID.
     * @param id The ID of the participant to get.
     * @returns The participant by ID.
     */
    public static async getParticipantById(id: DatabaseIdentifier): Promise<ITicketParticipant | null> {
        const cacheKey: string = `ticketsParticipantById:${id}`
        const cachedValue: ITicketParticipant | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: ITicketParticipant | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(ticketsParticipantsTable)
                .where(eq(ticketsParticipantsTable.id, id))
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the participant by ticket ID and user ID.
     * @description This method is used to get the participant by ticket ID and user ID.
     * @param ticketId The ID of the ticket to get the participant by.
     * @param userId The ID of the user to get the participant by.
     * @returns The participant by ticket ID and user ID.
     */
    public static async getParticipantByTicketIdAndUserId(
        ticketId: DatabaseIdentifier,
        userId: DiscordSnowflake,
    ): Promise<ITicketParticipant | null> {
        const cacheKey: string = `ticketsParticipantByTicketIdAndUserId:${ticketId}:${userId}`
        const cachedValue: ITicketParticipant | NotFoundCacheFlag | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue === this.NOT_FOUND_CACHE_FLAG ? null : cachedValue

        const queriedValue: ITicketParticipant | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(ticketsParticipantsTable)
                .where(
                    and(eq(ticketsParticipantsTable.ticketId, ticketId), eq(ticketsParticipantsTable.userId, userId)),
                )
                .execute(),
        )
        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates a participant.
     * @description This method is used to create a participant.
     * @param payload The payload of the participant.
     * @returns The created participant.
     */
    public static async createParticipant(
        payload: ITicketParticipantCreatePayload,
    ): Promise<ITicketParticipant | null> {
        if (await this.getParticipantByTicketIdAndUserId(payload.ticketId, payload.userId)) return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if (await this.getParticipantById(id)) continue

            const participant: ITicketParticipant = this.resolveCreateElement({
                id,
                ...payload,
            })

            await DatabaseClient.drizzleInstance.insert(ticketsParticipantsTable).values(participant).execute()
            await CacheClient.deleteValuesByPattern(
                `ticketsParticipantsCount:${payload.ticketId}`,
                `ticketsParticipantsByTicketId:${payload.ticketId}:*`,
                `ticketsParticipantById:${id}`,
                `ticketsParticipantByTicketIdAndUserId:${payload.ticketId}:${payload.userId}`,
            )
            return participant
        }

        return null
    }

    /**
     * @summary Deletes a participant by ID.
     * @description This method is used to delete a participant by ID.
     * @param id The ID of the participant to delete.
     * @returns The result of the deletion.
     */
    public static async deleteParticipantById(id: DatabaseIdentifier): Promise<boolean> {
        const participant: ITicketParticipant | null = await this.getParticipantById(id)
        if (participant === null) return false

        await DatabaseClient.drizzleInstance
            .delete(ticketsParticipantsTable)
            .where(eq(ticketsParticipantsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `ticketsParticipantsCount:${participant.ticketId}`,
            `ticketsParticipantsByTicketId:${participant.ticketId}:*`,
            `ticketsParticipantById:${id}`,
            `ticketsParticipantByTicketIdAndUserId:${participant.ticketId}:${participant.userId}`,
        )
        return true
    }

    /**
     * @summary Deletes the participants by ticket ID.
     * @description This method is used to delete the participants by ticket ID.
     * @param ticketId The ID of the ticket to delete the participants by.
     * @returns The result of the deletion.
     */
    public static async deleteParticipantsByTicketId(ticketId: DatabaseIdentifier): Promise<number> {
        const participants: ITicketParticipant[] = await this.internalGetParticipantsByTicketId(ticketId)
        if (participants.length === 0) return 0

        await DatabaseClient.drizzleInstance
            .delete(ticketsParticipantsTable)
            .where(eq(ticketsParticipantsTable.ticketId, ticketId))
            .execute()
        await CacheClient.deleteValuesByPattern(
            `ticketsParticipantsCount:${ticketId}`,
            `ticketsParticipantsByTicketId:${ticketId}:*`,
            ...participants.flatMap(({ id, userId }: ITicketParticipant): readonly string[] => [
                `ticketsParticipantById:${id}`,
                `ticketsParticipantByTicketIdAndUserId:${ticketId}:${userId}`,
            ]),
        )
        return participants.length
    }
}

export { TicketsParticipantsService }
