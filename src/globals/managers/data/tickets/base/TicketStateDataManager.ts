import { TicketState } from "@/oliverperzyk/models/services/databases/tickets/base/enums/TicketState"

/**
 * @summary The data manager for the tickets' states.
 * @description This class is used to manage the data for the tickets' states.
 */
class TicketStateDataManager {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The values of the tickets' states.
     * @description The values of the tickets' states.
     */
    private static readonly VALUES: ReadonlySet<TicketState> = new Set<TicketState>([
        TicketState.OPEN,
        TicketState.CLOSED,
        TicketState.DELETED,
    ])

    /**
     * @summary The values of the tickets' states in an array.
     * @description The values of the tickets' states in an array, used for schema definitions.
     */
    public static readonly VALUES_IN_ARRAY: readonly TicketState[] = Array.from(this.VALUES)

    /**
     * @summary Checks if a value is a valid tickets' states.
     * @description Checks if a value is a valid tickets' states.
     * @param value - The value to check.
     * @returns Boolean whether the value is a valid tickets' states, returned as a type guard.
     */
    public static isTicketState(value: string): value is TicketState {
        return this.VALUES.has(value as TicketState)
    }
}

export { TicketStateDataManager }
