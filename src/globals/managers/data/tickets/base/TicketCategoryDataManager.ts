import { TicketCategory } from "@/oliverperzyk/models/services/databases/tickets/base/enums/TicketCategory"

/**
 * @summary The data manager for the ticket categories.
 * @description This class is used to manage the data for the ticket categories.
 */
class TicketCategoryDataManager {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The values of the ticket categories.
     * @description The values of the ticket categories.
     */
    private static readonly VALUES: ReadonlySet<TicketCategory> = new Set<TicketCategory>([
        TicketCategory.NEED_HELP,
        TicketCategory.REDEEM_REWARD,
        TicketCategory.FUNDING,
        TicketCategory.OTHER,
    ])

    /**
     * @summary The values of the ticket categories in an array.
     * @description The values of the ticket categories in an array, used for schema definitions.
     */
    public static readonly VALUES_IN_ARRAY: readonly TicketCategory[] = Array.from(this.VALUES)

    /**
     * @summary Checks if a value is a valid ticket categories.
     * @description Checks if a value is a valid ticket categories.
     * @param value - The value to check.
     * @returns Boolean whether the value is a valid ticket categories, returned as a type guard.
     */
    public static isTicketCategory(value: string): value is TicketCategory {
        return this.VALUES.has(value as TicketCategory)
    }
}

export { TicketCategoryDataManager }
