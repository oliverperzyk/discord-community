import { BaseDatabaseService } from "../base/BaseDatabaseService"
import { CacheClient } from "@/oliverperzyk/globals/clients/CacheClient"
import { DatabaseClient } from "@/oliverperzyk/globals/clients/DatabaseClient"
import { ticketsTable } from "@/oliverperzyk/globals/databases/tickets/TicketsSchemas"
import { DatabaseIdentifierDataManager } from "@/oliverperzyk/globals/managers/data/base/DatabaseIdentifierDataManager"
import type { IPaginationResult } from "@/oliverperzyk/models/services/databases/base/interfaces/IPaginationResult"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { TicketState } from "@/oliverperzyk/models/services/databases/tickets/base/enums/TicketState"
import type { ITicket } from "@/oliverperzyk/models/services/databases/tickets/base/interfaces/ITicket"
import type { ITicketCreatePayload } from "@/oliverperzyk/models/services/databases/tickets/base/interfaces/ITicketCreatePayload"
import type { ITicketPaginationFilterOptions } from "@/oliverperzyk/models/services/databases/tickets/base/interfaces/ITicketPaginationFilterOptions"
import type { ITicketUpdatePayload } from "@/oliverperzyk/models/services/databases/tickets/base/interfaces/ITicketUpdatePayload"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { type SQL, and, eq } from "drizzle-orm"

/**
 * @summary The tickets service.
 * @description This service is used to manage the tickets.
 */
class TicketsService extends BaseDatabaseService {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary The tickets count cache key.
     * @description This is the cache key for the tickets count.
     */
    private static readonly TICKETS_COUNT_CACHE_KEY: string = "ticketsCount"

    /**
     * @summary Gets the tickets count.
     * @description This method is used to get the tickets count.
     * @returns The tickets count.
     */
    public static async getTicketsCount(): Promise<number> {
        const cachedValue: number | null = await CacheClient.getValue(this.TICKETS_COUNT_CACHE_KEY)
        if (cachedValue !== null) return cachedValue
        const queriedValue: number = await this.countEntriesInTable(ticketsTable)
        await CacheClient.setValue(this.TICKETS_COUNT_CACHE_KEY, queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the tickets by page.
     * @description This method is used to get the tickets by page.
     * @param page The page number.
     * @param options The options for the pagination.
     * @returns The tickets by page.
     */
    public static async getTicketsByPage(
        page: number,
        options?: ITicketPaginationFilterOptions,
    ): Promise<IPaginationResult<ITicket>> {
        const cacheKey: string = `ticketsByPage:${page}:${JSON.stringify(options)}`
        const cachedValue: IPaginationResult<ITicket> | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const where: SQL | undefined = and(
            options?.guildId ? eq(ticketsTable.guildId, options.guildId) : undefined,
            options?.createdByUserId ? eq(ticketsTable.createdByUserId, options.createdByUserId) : undefined,
            options?.category ? eq(ticketsTable.category, options.category) : undefined,
            options?.state ? eq(ticketsTable.state, options.state) : undefined,
        )

        const queriedValues: ITicket[] = await DatabaseClient.drizzleInstance
            .select()
            .from(ticketsTable)
            .where(where)
            .limit(this.PAGE_SIZE)
            .offset((page - 1) * this.PAGE_SIZE)
            .execute()
        const result: IPaginationResult<ITicket> = {
            items: queriedValues,
            totalCount: await this.countEntriesInTable(ticketsTable, where),
        }

        await CacheClient.setValue(cacheKey, result)
        return result
    }

    /**
     * @summary Gets the ticket by ID.
     * @description This method is used to get the ticket by ID.
     * @param id The ID of the ticket.
     * @returns The ticket by ID.
     */
    public static async getTicketById(id: DatabaseIdentifier): Promise<ITicket | null> {
        const cacheKey: string = `ticketById:${id}`
        const cachedValue: ITicket | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: ITicket | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(ticketsTable)
                .where(eq(ticketsTable.id, id))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Gets the ticket by guild ID and channel ID.
     * @description This method is used to get the ticket by guild ID and channel ID.
     * @param guildId The ID of the guild.
     * @param channelId The ID of the channel.
     * @returns The ticket by guild ID and channel ID.
     */
    public static async getTicketByGuildIdAndChannelId(
        guildId: DiscordSnowflake,
        channelId: DiscordSnowflake,
    ): Promise<ITicket | null> {
        const cacheKey: string = `ticketByGuildIdAndChannelId:${guildId}:${channelId}`
        const cachedValue: ITicket | null = await CacheClient.getValue(cacheKey)
        if (cachedValue !== null) return cachedValue

        const queriedValue: ITicket | null = this.resolveSingleItemQueryResult(
            await DatabaseClient.drizzleInstance
                .select()
                .from(ticketsTable)
                .where(and(eq(ticketsTable.guildId, guildId), eq(ticketsTable.channelId, channelId)))
                .limit(1)
                .execute(),
        )

        await CacheClient.setValue(cacheKey, queriedValue === null ? this.NOT_FOUND_CACHE_FLAG : queriedValue)
        return queriedValue
    }

    /**
     * @summary Creates a ticket.
     * @description This method is used to create a ticket.
     * @param payload The payload of the ticket.
     * @returns The created ticket.
     */
    public static async createTicket(payload: ITicketCreatePayload): Promise<ITicket | null> {
        if (payload.channelId && (await this.getTicketByGuildIdAndChannelId(payload.guildId, payload.channelId)))
            return null
        for (let i: number = 0; i < this.MAX_CREATION_ATTEMPTS; i++) {
            const id: DatabaseIdentifier = DatabaseIdentifierDataManager.randomDatabaseIdentifier
            if (await this.getTicketById(id)) continue

            const ticket: ITicket = this.resolveCreateElement({
                id,
                ...payload,
                channelId: payload.channelId ?? null,
                comment: null,
                state: TicketState.OPEN,
            })

            await DatabaseClient.drizzleInstance.insert(ticketsTable).values(ticket).execute()

            await CacheClient.deleteValuesByPattern(
                this.TICKETS_COUNT_CACHE_KEY,
                `ticketsByPage:*`,
                `ticketById:${id}`,
                `ticketByGuildIdAndChannelId:${payload.guildId}:${payload.channelId}`,
            )
            return ticket
        }

        return null
    }

    /**
     * @summary Updates a ticket.
     * @description This method is used to update a ticket.
     * @param id The ID of the ticket.
     * @param payload The payload of the ticket.
     * @returns The updated ticket.
     */
    public static async updateTicket(id: DatabaseIdentifier, payload: ITicketUpdatePayload): Promise<ITicket | null> {
        const ticket: ITicket | null = await this.getTicketById(id)
        if (ticket === null) return null
        const updatedTicket: ITicket = this.resolveUpdateElement({
            ...ticket,
            ...payload,
        })

        await DatabaseClient.drizzleInstance
            .update(ticketsTable)
            .set(updatedTicket)
            .where(eq(ticketsTable.id, id))
            .execute()
        await CacheClient.deleteValuesByPattern(
            this.TICKETS_COUNT_CACHE_KEY,
            `ticketsByPage:*`,
            `ticketById:${id}`,
            `ticketByGuildIdAndChannelId:${ticket.guildId}:${ticket.channelId}`,
        )
        return updatedTicket
    }

    /**
     * @summary Deletes a ticket by ID.
     * @description This method is used to delete a ticket by ID.
     * @param id The ID of the ticket.
     * @returns The result of the deletion.
     */
    public static async deleteTicketById(id: DatabaseIdentifier): Promise<boolean> {
        const ticket: ITicket | null = await this.getTicketById(id)
        if (ticket === null) return false

        await DatabaseClient.drizzleInstance.delete(ticketsTable).where(eq(ticketsTable.id, id)).execute()
        await CacheClient.deleteValuesByPattern(
            this.TICKETS_COUNT_CACHE_KEY,
            `ticketsByPage:*`,
            `ticketById:${id}`,
            `ticketByGuildIdAndChannelId:${ticket.guildId}:${ticket.channelId}`,
        )
        return true
    }
}

export { TicketsService }
