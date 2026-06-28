/**
 * @summary Entrypoint for the application.
 * @description This class initialized the application and starts the bot.
 */
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
     * @summary Initialize the application.
     * @description Initialize the application and start the bot.
     */
    private static async init(): Promise<void> {
        console.log("Hello, world!")
    }
}
