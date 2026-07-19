import type { NodeEnvironment } from "../models/globals/environment/enums/NodeEnvironment"
import { EnvironmentVariablesDataManager } from "./managers/security/EnvironmentVariablesDataManager"

/**
 * @summary Environment variables class.
 * @description A class that contains the environment variables in readonly mode for the application.
 */
class EnvironmentVariables {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Application's environment.
     * @description Environment that the application is running in.
     */
    public static readonly NODE_ENV: NodeEnvironment = EnvironmentVariablesDataManager.getNodeEnvironment()

    /**
     * @summary Port that the application will listen on.
     * @description Port for HTTP server that the application will listen on.
     */
    public static readonly APP_PORT: number = EnvironmentVariablesDataManager.getPort("APP_PORT", true)
    /**
     * @summary Host that the application will listen on.
     * @description Host for HTTP server that the application will listen on.
     */
    public static readonly APP_HOST: string = EnvironmentVariablesDataManager.getString("APP_HOST", true)

    /**
     * @summary Token for the Discord's application.
     * @description Token for the Discord's application, used to authenticate the application.
     */
    public static readonly DISCORD_TOKEN: string = EnvironmentVariablesDataManager.getString("DISCORD_TOKEN", true)
    /**
     * @summary Identifier of the Discord's application.
     * @description Identifier of the Discord's application, used to identify the application in Discord.
     */
    public static readonly DISCORD_APPLICATION_IDENTIFIER: string = EnvironmentVariablesDataManager.getString("DISCORD_APPLICATION_IDENTIFIER", true)

    /**
     * @summary URL of the database.
     * @description URL of the database, used to connect to the database.
     */ 
    public static readonly DATABASE_URL: URL = EnvironmentVariablesDataManager.getURL("DATABASE_URL", true)

    /**
     * @summary URL of the caching engine.
     * @description URL of the caching engine, used to connect to the caching engine.
     * @remarks If the caching engine is not set, then the caching engine will not be disabled.
     */
    public static readonly CACHE_URL: URL | undefined = EnvironmentVariablesDataManager.getURL("CACHE_URL", false)
}

export { EnvironmentVariables }
