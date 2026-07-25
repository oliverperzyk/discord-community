import { env } from "bun"
import { exit } from "process"

/**
 * @summary Docker healthcheck script.
 * @description Probes the application's `/health` endpoint from inside the container.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class HealthCheckDockerScript {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Static initializer.
     * @description Runs the healthcheck and exits with a non-zero status on failure.
     */
    static {
        void this.run()
    }

    /**
     * @summary Run the healthcheck.
     * @description Fetches `/health` on localhost using `APP_PORT`.
     */
    private static async run(): Promise<void> {
        const port: string = env.APP_PORT ?? "3000"

        try {
            const response: Response = await fetch(`http://127.0.0.1:${port}/health`)

            if (!response.ok) {
                exit(1)
            }

            exit(0)
        } catch (error: unknown) {
            console.error("Healthcheck failed.", error)
            exit(1)
        }
    }
}
