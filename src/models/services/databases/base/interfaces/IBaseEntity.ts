import type { DatabaseIdentifier } from "../types/DatabaseIdentifier"

/**
 * @summary Base entity interface.
 * @description A base interface for all entities in the database.
 */
interface IBaseEntity {
    /**
     * @summary Entity's identifier.
     * @description The identifier of the entity.
     */
    readonly id: DatabaseIdentifier
    /**
     * @summary Entity's creation date.
     * @description The date and time the entity was created.
     */
    readonly createdAt: Date
    /**
     * @summary Entity's update date.
     * @description The date and time the entity was last updated.
     */
    readonly updatedAt: Date
}

export type { IBaseEntity }
