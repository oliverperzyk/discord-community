import type { DiscordSnowflake } from "../../../discord/base/types/DiscordSnowflake"
import type { DatabaseIdentifier } from "../../base/types/DatabaseIdentifier"

/**
 * @summary The testing things participant create payload interface.
 * @description This interface is used to store the testing things participant create payload.
 */
interface ITestingThingsParticipantCreatePayload {
    /**
     * @summary The testing thing ID.
     * @description ID of the testing thing to create the participant for.
     */
    readonly testingThingId: DatabaseIdentifier
    /**
     * @summary The user ID.
     * @description ID of the user to create the participant for.
     */
    readonly userId: DiscordSnowflake
}

export type { ITestingThingsParticipantCreatePayload }
