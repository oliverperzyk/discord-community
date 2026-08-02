import type { VerificationRequestState } from "../enums/VerificationRequestState"

/**
 * @summary Represents the payload for updating a verification request.
 * @description This interface is used to store the payload for updating a verification request.
 */
interface IVerificationRequestUpdatePayload {
    /**
     * @summary The state of the verification request.
     * @description The state of the verification request (e.g. OPENED, CLOSED, etc.).
     */
    readonly state: VerificationRequestState
}

export type { IVerificationRequestUpdatePayload }
