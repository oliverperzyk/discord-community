/**
 * @summary Tickets' categories.
 * @description This enumration has all categories that ticket can have.
 */
const enum TicketCategory {
    /**
     * @summary Related to support site, e.g. more internal usage of the library.
     */
    NEED_HELP = "NEED_HELP",
    /**
     * @summary Used for giveaways' winners.
     */
    REDEEM_REWARD = "REDEEM_REWARD",
    /**
     * @summary Used to fund contributors (or me) of certain projects.
     */
    FUNDING = "FUNDING",
    /**
     * @summary Related to any other topics.
     */
    OTHER = "OTHER",
}

export { TicketCategory }
