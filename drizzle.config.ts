import { env } from "bun"
import type { Config } from "drizzle-kit"

/**
 * @summary Configuration of Drizzle ORM.
 * @description This class is demand to handle database's endpoint & pass it to Drizzle's configuration.
 */
class DrizzleConfiguration {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Database's endpoint.
     * @description Getter method that returns and validates database's endpoint.
     * @throws If environment variable (`DATABASE_URL`) is not defined or URL is invalid.
     */
    private static get DATABASE_URL(): string {
        const rawValue: string | undefined = env.DATABASE_URL
        if (!rawValue) throw new Error("Couldn't finish migration. Environment variable DATABASE_URL is missing.")

        try {
            return new URL(rawValue).toString()
        } catch {
            throw new Error(
                "Couldn't finish migration. Environment variable DATABASE_URL is not a valid database endpoint.",
            )
        }
    }

    /**
     * @summary Configuration of Drizzle ORM.
     * @description Complete configuration of Drizzle's ORM and Kit.
     */
    public static readonly CONFIGURATION: Config = {
        schema: "./src/globals/databases/DatabaseSchemas.ts",
        dialect: "postgresql",
        casing: "camelCase",
        strict: true,
        dbCredentials: {
            url: DrizzleConfiguration.DATABASE_URL,
        },
    }
}

export default DrizzleConfiguration.CONFIGURATION
