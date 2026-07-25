import { type Server, createServer } from "node:net"
import { EnvironmentVariables } from "./globals/EnvironmentVariables"
import { ApplicationInstanceManager } from "./globals/managers/ApplicationInstanceManager"
import { EventListenerRegistry } from "./events/base/EventListenerRegistry"

/**
 * @summary Entrypoint for the application.
 * @description This class initialized the application and starts the bot.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Main {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Static initializer.
     * @description Static initializer to initialize the application.
     */
    static {
        void this.init()
    }

    /**
     * @summary Check if a port is available on the given host.
     * @param port - The port to check.
     * @param hostname - The host to bind when checking.
     */
    private static async isPortAvailable(port: number, hostname: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const server: Server = createServer()

            server.once("error", (error: Readonly<{ code: string }>) => {
                if (error.code === "EADDRINUSE") {
                    resolve(false)
                    return
                }

                reject(error)
            })

            server.once("listening", () => {
                server.close((closeError) => {
                    if (closeError) {
                        reject(closeError)
                        return
                    }

                    resolve(true)
                })
            })

            server.listen(port, hostname)
        })
    }

    /**
     * @summary Initialize the application.
     * @description Initialize the application and start the bot.
     */
    private static async init(): Promise<void> {
        if (!(await this.isPortAvailable(EnvironmentVariables.APP_PORT, EnvironmentVariables.APP_HOST))) {
            throw new Error(
                `Port ${EnvironmentVariables.APP_PORT} is not available on ${EnvironmentVariables.APP_HOST}.`,
            )
        }

        await EventListenerRegistry.initializeEventListeners()
        ApplicationInstanceManager.instance.get("/health", (): Readonly<{ status: string }> => {
            return { status: "ok" }
        })
        await ApplicationInstanceManager.instance.listen(
            {
                port: EnvironmentVariables.APP_PORT,
                hostname: EnvironmentVariables.APP_HOST,
            },
            async (): Promise<void> => {},
        )
    }
}
