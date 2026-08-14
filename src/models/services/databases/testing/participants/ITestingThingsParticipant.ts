import type { IBaseEntity } from "../../base/interfaces/IBaseEntity"
import type { DiscordSnowflake } from "../../../discord/base/types/DiscordSnowflake"
import type { DatabaseIdentifier } from "../../base/types/DatabaseIdentifier"

/**
 * @summary The testing things participant interface.
 * @description This interface is used to store the testing things participant.
 */
interface ITestingThingsParticipant extends IBaseEntity {
    /**
     * @summary The testing thing ID.
     * @description ID of the testing thing.
     */
    readonly testingThingId: DatabaseIdentifier
    /**
     * @summary The user ID.
     * @description ID of the user.
     */
    readonly userId: DiscordSnowflake
}

export type { ITestingThingsParticipant }
