import type { TicketCategory } from "../enums/TicketCategory"
import type { TicketState } from "../enums/TicketState"

/**
 * @summary The ticket update payload interface.
 * @description This interface is used to update a ticket.
 */
interface ITicketUpdatePayload {
    /**
     * @summary The comment of the ticket.
     * @description This is the comment of the ticket.
     */
    readonly comment?: string
    /**
     * @summary The category of the ticket.
     * @description This is the category of the ticket.
     */
    readonly category?: TicketCategory
    /**
     * @summary The state of the ticket.
     * @description This is the state of the ticket.
     */
    readonly state?: TicketState
}

export type { ITicketUpdatePayload }
