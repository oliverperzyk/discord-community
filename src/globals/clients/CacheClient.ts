import { RedisClient } from "bun"
import { EnvironmentVariables } from "../EnvironmentVariables"
import { ClientStatus } from "@/oliverperzyk/models/globals/clients/general/enums/ClientStatus"

/**
 * @summary Manager of cache connections.
 * @description This class follows singleton pattern for Redis client.
 */
class CacheClient {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}
    /**
     * @summary Internal instance of Redis client.
     */
    private static internalInstance: RedisClient | null = null

    /**
     * @summary Serialize a value to a string.
     * @description Serialize a value to a string, for setting values to cache.
     * @param value - The value to serialize.
     * @returns The serialized value.
     */
    private static serialize(value: unknown): string {
        return JSON.stringify(value)
    }

    /**
     * @summary Deserialize a string to a value.
     * @description Deserialize a string to a value, for getting values from cache.
     * @param value - The string to deserialize.
     * @template T - The type of the value to deserialize.
     * @returns The deserialized value of type `T`.
     */
    private static deserialize<T>(value: string): T {
        return JSON.parse(value)
    }

    /**
     * @summary Getter for Redis client.
     * @description Getter for Redis client.
     * @returns The Redis client.
     */
    public static get instance(): RedisClient {
        if (!this.internalInstance) {
            this.internalInstance = new RedisClient(EnvironmentVariables.CACHE_URL?.toString())
        }

        return this.internalInstance
    }

    /**
     * @summary Get a value from cache.
     * @description Get a value from cache.
     * @param key - The key to get the value from.
     * @param defaultValue - The default value to return if the key is not found.
     * @returns The value from cache or the default value if the key is not found.
     */
    public static async getValue<T>(key: string): Promise<T | null>
    public static async getValue<T>(key: string, defaultValue: T): Promise<T>
    public static async getValue<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
        if (EnvironmentVariables.CACHE_URL === undefined) return defaultValue
        const value: string | null = await this.instance.get(key)
        return value === null ? defaultValue : this.deserialize(value)
    }

    /**
     * @summary Get keys from cache.
     * @description Get keys from cache.
     * @param patterns - The patterns to get the keys from.
     * @returns The keys from cache.
     */
    public static async getKeys(...patterns: readonly string[]): Promise<string[]> {
        if (EnvironmentVariables.CACHE_URL === undefined) return []
        switch (patterns.length) {
            case 0:
                return await this.instance.keys("*")
            case 1:
                return await this.instance.keys(patterns[0])
            default:
                return (await Promise.all(patterns.map((pattern: string) => this.instance.keys(pattern)))).flat()
        }
    }

    /**
     * @summary Get the time to live of a key.
     * @description Get the time to live of a key, in seconds.
     * @param key - The key to get the time to live of.
     * @returns The time to live of the key, in seconds, or null if the key is not found.
     * @remarks Value `-1` means that the key has no expiration time.
     */
    public static async getTimeToLive(key: string): Promise<number | null> {
        if (EnvironmentVariables.CACHE_URL === undefined) return null
        const timeToLive: number | null = await this.instance.ttl(key)
        return timeToLive === -2 ? null : timeToLive
    }

    /**
     * @summary Set a value in cache.
     * @description Set a value in cache.
     * @param key - The key to set the value to.
     * @param value - The value to set.
     * @param timeToLive - The time to live of the key, in seconds.
     * @returns `true` if the value was set successfully, `false` otherwise.
     */
    public static async setValue(key: string, value: unknown, timeToLive: number | null = null): Promise<boolean> {
        if (EnvironmentVariables.CACHE_URL === undefined) return false
        await Promise.all([
            this.instance.set(key, this.serialize(value)),
            timeToLive !== null ? this.instance.expire(key, timeToLive) : Promise.resolve(),
        ])
        return true
    }

    /**
     * @summary Set the time to live of a key.
     * @description Set the time to live of a key, in seconds.
     * @param key - The key to set the time to live of.
     * @param timeToLive - The time to live of the key, in seconds. To make this key permanent, set this value to `-1`.
     * @remarks Value `-1` means that the key has no expiration time.
     * @returns `true` if the time to live was set successfully, `false` otherwise.
     */
    public static async setTimeToLive(key: string, timeToLive: number): Promise<boolean> {
        if (EnvironmentVariables.CACHE_URL === undefined) return false
        await this.instance.expire(key, timeToLive)
        return true
    }

    /**
     * @summary Increment a value in cache.
     * @description Increment a value in cache.
     * @param key - The key to increment the value of.
     * @param by - The amount to increment the value by.
     * @returns The new value of the key.
     */
    public static async increment(key: string, by: number = 1): Promise<number> {
        if (EnvironmentVariables.CACHE_URL === undefined) return 0
        return this.instance.incrby(key, by)
    }

    /**
     * @summary Decrement a value in cache.
     * @description Decrement a value in cache.
     * @param key - The key to decrement the value of.
     * @param by - The amount to decrement the value by.
     * @returns The new value of the key.
     */
    public static async decrement(key: string, by: number = 1): Promise<number> {
        if (EnvironmentVariables.CACHE_URL === undefined) return 0
        return this.instance.decrby(key, by)
    }

    /**
     * @summary Delete values from cache.
     * @description Delete values from cache.
     * @param keys - The keys to delete.
     */
    public static async deleteValues(...keys: readonly string[]): Promise<void> {
        if (EnvironmentVariables.CACHE_URL === undefined) return
        await this.instance.del(...keys)
    }

    /**
     * @summary Delete values from cache by keys or patterns.
     * @description Delete values from cache by keys or patterns. It's recommended to use `deleteValues` method if you don't need to delete values by pattern, as it's faster than this method.
     * @param keysOrPatterns - The keys or patterns to delete.
     * @returns The void.
     */
    public static async deleteValuesByPattern(...keysOrPatterns: readonly string[]): Promise<void> {
        if (EnvironmentVariables.CACHE_URL === undefined) return
        const regularKeys: string[] = []
        const patterns: string[] = []
        for (const keyOrPattern of keysOrPatterns) {
            if (keyOrPattern.includes("*")) {
                patterns.push(keyOrPattern)
            } else {
                regularKeys.push(keyOrPattern)
            }
        }

        await this.instance.del(
            ...regularKeys,
            ...(await Promise.all(patterns.map((pattern: string) => this.instance.keys(pattern)))).flat(),
        )
    }

    /**
     * @summary Clear the cache.
     * @description Clears whole cache.
     * @returns The void.
     */
    public static async clear(): Promise<void> {
        if (EnvironmentVariables.CACHE_URL === undefined) return
        await this.instance.send("FLUSHALL", [])
    }

    /**
     * @summary Ping the cache.
     * @description Pings the cache to check if it is running.
     * @returns The status of the cache.
     */
    public static async ping(): Promise<ClientStatus> {
        if (EnvironmentVariables.CACHE_URL === undefined) return ClientStatus.DISABLED
        try {
            await this.instance.ping()
            return ClientStatus.RUNNING
        } catch {
            return ClientStatus.DOWN
        }
    }
}

export { CacheClient }
