import type { SQL } from "drizzle-orm"
import type { PostgresTriggerEvent } from "@/oliverperzyk/models/services/databases/base/triggers/types/PostgresTriggerEvent"
import type { PostgresTriggerOrientation } from "@/oliverperzyk/models/services/databases/base/triggers/types/PostgresTriggerOrientation"
import type { PostgresTriggerTiming } from "@/oliverperzyk/models/services/databases/base/triggers/types/PostgresTriggerTiming"

/**
 * @summary Interface for the updated-at trigger configuration.
 * @description This interface is used to store the updated-at trigger configuration.
 */
interface IUpdatedAtTriggerConfig {
    /**
     * @summary The trigger timing.
     */
    readonly when: PostgresTriggerTiming

    /**
     * @summary The trigger events.
     */
    readonly events: [PostgresTriggerEvent, ...PostgresTriggerEvent[]]

    /**
     * @summary The trigger orientation.
     */
    readonly forEach?: PostgresTriggerOrientation

    /**
     * @summary The trigger function call.
     */
    readonly execute: SQL
}

export type { IUpdatedAtTriggerConfig }
