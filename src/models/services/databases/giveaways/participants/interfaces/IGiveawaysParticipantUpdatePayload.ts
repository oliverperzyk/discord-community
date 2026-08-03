/**
 * @summary The giveaways participant update payload interface.
 * @description This interface represents the payload for updating a giveaways participant.
 */
interface IGiveawaysParticipantUpdatePayload {
    /**
     * @summary Whether the user is a winner of the giveaway.
     */
    readonly isWinner?: boolean
}

export type { IGiveawaysParticipantUpdatePayload }
