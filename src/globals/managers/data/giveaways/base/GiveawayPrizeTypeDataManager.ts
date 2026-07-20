import { GiveawayPrizeType } from "@/oliverperzyk/models/services/databases/giveaways/base/enums/GIveawayPrizeType"

/**
 * @summary The data manager for the giveaway prize type.
 * @description This class is used to manage the data for the giveaway prize type.
 */
class GiveawayPrizeTypeDataManager {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The values of the giveaway prize type.
     * @description The values of the giveaway prize type.
     */
    private static readonly VALUES: ReadonlySet<GiveawayPrizeType> = new Set<GiveawayPrizeType>([
        GiveawayPrizeType.ROLE,
        GiveawayPrizeType.OTHER,
    ])

    /**
     * @summary The values of the giveaway prize type in an array.
     * @description The values of the giveaway prize type in an array, used for schema definitions.
     */
    public static readonly VALUES_IN_ARRAY: readonly GiveawayPrizeType[] = Array.from(this.VALUES)

    /**
     * @summary Checks if a value is a valid giveaway prize type.
     * @description Checks if a value is a valid giveaway prize type.
     * @param value - The value to check.
     * @returns Boolean whether the value is a valid giveaway prize type, returned as a type guard.
     */
    public static isGiveawayPrizeType(value: string): value is GiveawayPrizeType {
        return this.VALUES.has(value as GiveawayPrizeType)
    }
}

export { GiveawayPrizeTypeDataManager }
