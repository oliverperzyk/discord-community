/**
 * @summary Type for the Discord snowflake.
 * @description This type is used to store the Discord snowflake.
 */
type DiscordSnowflake = string & { readonly brand: unique symbol }

export type { DiscordSnowflake }
