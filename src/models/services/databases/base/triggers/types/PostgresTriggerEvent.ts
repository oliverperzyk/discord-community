/**
 * @summary Type for the PostgreSQL trigger event.
 * @description This type is used to store the PostgreSQL trigger event.
 */
type PostgresTriggerEvent = "INSERT" | "UPDATE" | "DELETE" | "TRUNCATE"

export type { PostgresTriggerEvent }
