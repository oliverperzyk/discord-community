import { ModeratorsPunishmentType } from "@/oliverperzyk/models/services/databases/moderator/punishments/enums/ModeratorsPunishmentType"

/**
 * @summary The data manager for the moderators' punishment types.
 * @description This class is used to manage the data for the moderators' punishment types.
 */
class ModeratorsPunishmentTypeDataManager {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The values of the moderators' punishment types.
     * @description The values of the moderators' punishment types.
     */
    private static readonly VALUES: ReadonlySet<ModeratorsPunishmentType> = new Set<ModeratorsPunishmentType>([
        ModeratorsPunishmentType.WARNING,
        ModeratorsPunishmentType.TIMEOUT,
        ModeratorsPunishmentType.KICK,
        ModeratorsPunishmentType.BAN,
    ])

    /**
     * @summary The values of the moderators' punishment types in an array.
     * @description The values of the moderators' punishment types in an array, used for schema definitions.
     */
    public static readonly VALUES_IN_ARRAY: readonly ModeratorsPunishmentType[] = Array.from(this.VALUES)

    /**
     * @summary Checks if a value is a valid moderators' punishment types.
     * @description Checks if a value is a valid moderators' punishment types.
     * @param value - The value to check.
     * @returns Boolean whether the value is a valid moderators' punishment types, returned as a type guard.
     */
    public static isModeratorsPunishmentType(value: string): value is ModeratorsPunishmentType {
        return this.VALUES.has(value as ModeratorsPunishmentType)
    }
}

export { ModeratorsPunishmentTypeDataManager }
