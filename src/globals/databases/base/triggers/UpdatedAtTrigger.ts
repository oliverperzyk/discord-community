import { entityKind, type SQL } from "drizzle-orm"
import type { IUpdatedAtTriggerConfig } from "@/oliverperzyk/models/services/databases/base/triggers/interfaces/IUpdatedAtTriggerConfig"
import type { PostgresTriggerEvent } from "@/oliverperzyk/models/services/databases/base/triggers/types/PostgresTriggerEvent"
import type { PostgresTriggerOrientation } from "@/oliverperzyk/models/services/databases/base/triggers/types/PostgresTriggerOrientation"
import type { PostgresTriggerTiming } from "@/oliverperzyk/models/services/databases/base/triggers/types/PostgresTriggerTiming"

/**
 * @summary PostgreSQL trigger definition for updated-at columns.
 * @description Mirrors Drizzle's upcoming `PgTrigger` shape so it can be attached to table extra config.
 */
class UpdatedAtTrigger implements IUpdatedAtTriggerConfig {
    /**
     * @summary Entity kind identifier.
     */
    public static readonly [entityKind]: string = "PgTrigger"

    /**
     * @summary Trigger timing.
     */
    public readonly when: PostgresTriggerTiming

    /**
     * @summary Trigger events.
     */
    public readonly events: [PostgresTriggerEvent, ...PostgresTriggerEvent[]]

    /**
     * @summary Trigger orientation.
     */
    public readonly forEach: PostgresTriggerOrientation | undefined

    /**
     * @summary Trigger function call.
     */
    public readonly execute: SQL

    /**
     * @summary Creates a new updated-at trigger definition.
     * @param name - The name of the trigger.
     * @param config - The trigger configuration.
     */
    public constructor(
        public readonly name: string,
        config: Readonly<IUpdatedAtTriggerConfig>,
    ) {
        this.when = config.when
        this.events = config.events
        this.forEach = config.forEach
        this.execute = config.execute
    }
}

export { UpdatedAtTrigger }
