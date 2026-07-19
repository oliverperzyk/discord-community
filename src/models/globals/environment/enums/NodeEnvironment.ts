/**
 * @summary Node environment enum.
 * @description A enum that represents the environment of the application.
 */
const enum NodeEnvironment {
    /**
     * @summary Development environment.
     * @description Environment for development use, e.g. local development server.
     */
    DEVELOPMENT = "development",
    /**
     * @summary Production environment.
     * @description Environment for production use, e.g. production server.
     */
    PRODUCTION = "production",
    /**
     * @summary Test environment.
     * @description Environment for testing the application, e.g. CI pipeline.
     */
    TEST = "test"
}

export { NodeEnvironment }
