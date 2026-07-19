import { Elysia } from "elysia"

/**
 * @summary Manager of HTTP server's instance.
 * @description This class matches singleton pattern for Elysia's (HTTP framework) instance.
 */
class ApplicationInstanceManager {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}
    /**
     * @summary Internal instance of Elysia.
     */
    private static internalInstance: Elysia | null = null

    /**
     * @summary Elysia's instance.
     * @description Getter method of Elysia's (HTTP framework) instance.
     */
    public static get instance(): Elysia {
        if (!this.internalInstance) {
            this.internalInstance = new Elysia()
        }

        return this.internalInstance
    }
}

export { ApplicationInstanceManager }
