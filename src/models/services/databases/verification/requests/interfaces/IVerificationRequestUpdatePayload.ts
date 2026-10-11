import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
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
    /**
     * @summary The comment of the verification request by a moderator.
     * @description The comment of the verification request by a moderator. Might be null if the moderator comment is not provided.
     */
    readonly moderatorComment: string | null
    /**
     * @summary The ID of the user who reviewed the verification request.
     * @description The ID of the user who reviewed the verification request. Might be null if the verification request is not reviewed.
     */
    readonly reviewedByUserId: DiscordSnowflake | null
}

export type { IVerificationRequestUpdatePayload }
