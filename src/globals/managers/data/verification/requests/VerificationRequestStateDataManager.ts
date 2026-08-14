import { VerificationRequestState } from "@/oliverperzyk/models/services/databases/verification/requests/enums/VerificationRequestState"

/**
 * @summary The data manager for the verification request states.
 * @description This class is used to manage the data for the verification request states.
 */
class VerificationRequestStateDataManager {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The values of the verification request states.
     * @description The values of the verification request states.
     */
    private static readonly VALUES: ReadonlySet<VerificationRequestState> = new Set<VerificationRequestState>([
        VerificationRequestState.UNOPENED,
        VerificationRequestState.ACCEPTED,
        VerificationRequestState.REJECTED,
    ])

    /**
     * @summary The values of the verification request states in an array.
     * @description The values of the verification request states in an array, used for schema definitions.
     */
    public static readonly VALUES_IN_ARRAY: readonly VerificationRequestState[] = Array.from(this.VALUES)

    /**
     * @summary Checks if a value is a valid verification request states.
     * @description Checks if a value is a valid verification request states.
     * @param value - The value to check.
     * @returns Boolean whether the value is a valid verification request states, returned as a type guard.
     */
    public static isVerificationRequestState(value: string): value is VerificationRequestState {
        return this.VALUES.has(value as VerificationRequestState)
    }
}

export { VerificationRequestStateDataManager }
