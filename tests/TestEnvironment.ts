import { file, write } from "bun"

/**
 * @summary Entrypoint that initializes the test environment.
 * @description This class initializes the test environment.
 */
class TestEnvironment {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Initialization promise.
     * @description Allows the preload to await test environment initialization.
     */
    public static readonly initialization: Promise<void> = this.init()

    /**
     * @summary Initialize the test environment.
     * @description Initialize the test environment.
     */
    private static async init(): Promise<void> {
        console.log("Initializing test environment...")
        const exampleEnvironment: URL = new URL("../.env.example", import.meta.url)
        for (const relativePath of ["../.env", "../deployment/.env"]) {
            const environment: URL = new URL(relativePath, import.meta.url)
            if (!(await file(environment).exists())) {
                await write(environment, file(exampleEnvironment))
            }
        }
    }
}

await TestEnvironment.initialization
