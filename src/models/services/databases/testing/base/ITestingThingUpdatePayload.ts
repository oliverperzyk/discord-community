/**
 * @summary The testing thing update payload interface.
 * @description This interface is used to update a testing thing.
 */
interface ITestingThingUpdatePayload {
    /**
     * @summary The channel name.
     * @description Name of the channel for the recruitment.
     */
    readonly channelName?: string
    /**
     * @summary The maximum number of participants.
     * @description Maximum number of participants for the recruitment.
     * @remarks If it's null, there is no limit.
     */
    readonly maxParticipants?: number | null
    /**
     * @summary The start date.
     * @description Start date of the recruitment.
     */
    readonly startsAt?: Date
    /**
     * @summary The end date.
     * @description End date of the recruitment.
     */
    readonly endsAt?: Date
}

export type { ITestingThingUpdatePayload }
