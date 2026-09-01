import { DatabaseConstants } from "@/oliverperzyk/globals/databases/base/DatabaseConstants"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary Manager for the Discord snowflake data.
 * @description This class is used to manage the Discord snowflake data type.
 */
class DiscordSnowflakeDataManager {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The Discord epoch in milliseconds.
     * @description The first second of 2015, used as the epoch for Discord snowflakes.
     */
    private static readonly DISCORD_EPOCH_MILLISECONDS: bigint = 1420070400000n

    /**
     * @summary The maximum 64-bit unsigned integer.
     * @description Discord snowflakes are 64-bit integers and cannot exceed this value.
     */
    private static readonly MAXIMUM_SNOWFLAKE_VALUE: bigint = (1n << 64n) - 1n

    /**
     * @summary The regex for a Discord snowflake.
     * @description 17–20 decimal digits with no leading zeros.
     */
    private static readonly DISCORD_SNOWFLAKE_REGEX: RegExp = new RegExp(
        `^[1-9]\\d{16,${DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH - 1}}$`,
    )

    /**
     * @summary Cast a value to a Discord snowflake.
     * @description This method is used to cast a value to a Discord snowflake.
     * @param value - The value to cast.
     * @returns The Discord snowflake.
     */
    public static castToDiscordSnowflake(value: unknown): DiscordSnowflake {
        if (!this.isDiscordSnowflake(value)) {
            throw new Error("Invalid Discord snowflake.")
        }

        return value as DiscordSnowflake
    }

    /**
     * @summary Check if a value is a Discord snowflake.
     * @description This method is used to check if a value is a Discord snowflake. It validates the decimal format and that the encoded timestamp is not in the future.
     * @param value - The value to check.
     * @returns Whether the value is a Discord snowflake, as a type guard.
     */
    public static isDiscordSnowflake(value: unknown): value is DiscordSnowflake {
        if (typeof value !== "string" || !this.DISCORD_SNOWFLAKE_REGEX.test(value)) {
            return false
        }

        const snowflake: bigint = BigInt(value)
        if (snowflake > this.MAXIMUM_SNOWFLAKE_VALUE) {
            return false
        }

        const timestampMilliseconds: number = Number((snowflake >> 22n) + this.DISCORD_EPOCH_MILLISECONDS)
        return timestampMilliseconds <= Date.now()
    }
}

export { DiscordSnowflakeDataManager }
