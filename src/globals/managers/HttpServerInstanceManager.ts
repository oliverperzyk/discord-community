import express, { type Express } from "express"
import cors from "cors"

/**
 * @summary Manager of HTTP server instance.
 * @description This class matches singleton pattern for HTTP server instance.
 */
class HttpServerInstanceManager {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}
    /**
     * @summary Internal instance of HTTP server.
     */
    private static internalInstance: Express | null = null

    /**
     * @summary HTTP server instance.
     * @description Getter method of HTTP server instance. It's configured already.
     */
    public static get instance(): Express {
        if (this.internalInstance === null) {
            this.internalInstance = express()
            this.internalInstance.use(
                cors({
                    origin: "*",
                    credentials: true,
                    methods: ["GET"],
                    allowedHeaders: ["Content-Type", "Authorization"],
                    optionsSuccessStatus: 204,
                }),
            )

            void this.loadRoutes()
        }

        return this.internalInstance
    }

    /**
     * @summary Load routes.
     * @description Load routes for HTTP server instance.
     */
    private static async loadRoutes(): Promise<void> {
        if (this.internalInstance === null) return
    }
}

export { HttpServerInstanceManager }
