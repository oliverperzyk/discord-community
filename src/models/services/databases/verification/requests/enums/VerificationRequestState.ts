/**
 * @summary The state of the verification request.
 * @description The state of the verification request (e.g. UNOPENED, ACCEPTED, REJECTED).
 */
const enum VerificationRequestState {
    /**
     * @summary The verification request is not opened.
     * @description The verification request has not been opened by a moderator yet.
     */
    UNOPENED = "UNOPENED",
    /**
     * @summary The verification request is accepted.
     * @description The verification has been approved by a moderator.
     */
    ACCEPTED = "ACCEPTED",
    /**
     * @summary The verification request is rejected.
     * @description The verification has been rejected by a moderator.
     */
    REJECTED = "REJECTED",
}

export { VerificationRequestState }
