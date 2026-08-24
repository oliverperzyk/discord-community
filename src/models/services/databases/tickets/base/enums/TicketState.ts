/**
 * @summary The ticket states enum.
 * @description This enum is used to store the state of the ticket.
 */
const enum TicketState {
    /**
     * @summary The open state.
     * @description This state is used to indicate that the ticket is open.
     */
    OPEN = "OPEN",
    /**
     * @summary The closed state.
     * @description This state is used to indicate that the ticket is closed.
     */
    CLOSED = "CLOSED",
    /**
     * @summary The deleted state.
     * @description This state is used to indicate that the ticket is deleted.
     */
    DELETED = "DELETED",
}

export { TicketState }
