import { BunSQLDatabase, drizzle } from "drizzle-orm/bun-sql"
import { SQL } from "bun"
import * as databaseSchemas from "../databases/DatabaseSchemas"
import { EnvironmentVariables } from "../EnvironmentVariables"
import { ClientStatus } from "@/oliverperzyk/models/globals/clients/general/enums/ClientStatus"

/**
 * @summary Manager of database connections.
 * @description This class follows singleton pattern for both - raw & Drizzle database connections.
 */
class DatabaseClient {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}
    /**
     * @summary Internal instance of Drizzle's database connection.
     */
    private static internalDrizzleInstance: BunSQLDatabase<typeof databaseSchemas> | null = null
    /**
     * @summary Internal instance of Bun's database connection.
     */
    private static internalBunInstance: SQL | null = null

    /**
     * @summary Getter for Drizzle's database connection.
     */
    public static get drizzleInstance(): BunSQLDatabase<typeof databaseSchemas> {
        if (!this.internalDrizzleInstance) {
            this.internalDrizzleInstance = drizzle(DatabaseClient.bunInstance, {
                schema: databaseSchemas,
                casing: "camelCase",
            })
        }

        return this.internalDrizzleInstance
    }

    /**
     * @summary Getter for Bun's database connection.
     */
    public static get bunInstance(): SQL {
        if (!this.internalBunInstance) {
            this.internalBunInstance = new SQL(EnvironmentVariables.DATABASE_URL)
        }

        return this.internalBunInstance
    }

    /**
     * @summary Ping the database.
     * @description Ping the database to check if it is running.
     * @returns The status of the database.
     */
    public static async ping(): Promise<ClientStatus.RUNNING | ClientStatus.DOWN> {
        try {
            const result: [1] = await DatabaseClient.bunInstance`SELECT 1`
            return result[0] === 1 ? ClientStatus.DOWN : ClientStatus.DOWN
        } catch {
            return ClientStatus.DOWN
        }
    }
}

export { DatabaseClient }
