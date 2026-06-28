/**
 * @summary Entrypoint that initializes the test environment.
 * @description This class initializes the test environment.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TestEnvironment {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Static initializer.
     * @description Static initializer to initialize the test environment.
     */
    static {
        void this.init()
    }

    /**
     * @summary Initialize the test environment.
     * @description Initialize the test environment.
     */
    private static async init(): Promise<void> {
        console.log("Initializing test environment...")
    }
}
