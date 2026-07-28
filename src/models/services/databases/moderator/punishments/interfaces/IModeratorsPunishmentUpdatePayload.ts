/**
 * @summary The moderators punishment update payload interface.
 * @description This interface is used to update a moderators punishment.
 */
interface IModeratorsPunishmentUpdatePayload {
    /**
     * @summary The comment.
     * @description The comment, the comment of the punishment.
     */
    readonly comment?: string
    /**
     * @summary The expires at.
     * @description The expires at, the date and time when the punishment expires.
     * @remarks If the punishment is permanent, the expires at will be `undefined`.
     */
    readonly expiresAt?: Date
}

export type { IModeratorsPunishmentUpdatePayload }
