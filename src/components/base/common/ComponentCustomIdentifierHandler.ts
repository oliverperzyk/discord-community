import type { IParsedRawCustomIdentifier } from "@/oliverperzyk/models/components/base/common/interfaces/IParsedRawCustomIdentifier"
import type { CustomIdentifierOptionsAllowedTypes } from "@/oliverperzyk/models/components/base/common/types/CustomIdentifierOptionsAllowedTypes"

/**
 * @summary The component custom identifier handler.
 * @description This class is used to handle the custom identifier for the component.
 */
class ComponentCustomIdentifierHandler {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Resolves the custom identifier.
     * @description Resolves the custom identifier, if the options are provided, it will add them to the custom identifier.
     * @param base - The base of the custom identifier.
     * @param options - The options of the custom identifier.
     * @returns The resolved custom identifier.
     */
    public static resolveCustomIdentifier(
        base: string,
        options?: Readonly<CustomIdentifierOptionsAllowedTypes>,
    ): string {
        let customIdentfier: string = base.trim().toLowerCase()
        if (options !== undefined) {
            customIdentfier += "?"
            switch (typeof options) {
                case "string":
                    customIdentfier += options
                    break
                case "number":
                case "boolean":
                    customIdentfier += options.toString()
                    break
                default:
                    customIdentfier += JSON.stringify(options)
                    break
            }
        }

        return customIdentfier
    }

    /**
     * @summary Parses the custom identifier.
     * @description Parses the custom identifier, if the options are provided, it will parse them into the correct type.
     * @param rawCustomIdentifier - The raw custom identifier.
     * @returns The parsed custom identifier.
     */
    public static parseCustomIdentifier<T extends CustomIdentifierOptionsAllowedTypes>(
        rawCustomIdentifier: string,
    ): IParsedRawCustomIdentifier<T> {
        const [customIdentifier, options] = rawCustomIdentifier.split("?").map((element: string) => element.trim())
        if (options === undefined || options === "") {
            return {
                customIdentifier,
                options: undefined,
            }
        }

        const numericalOptions: number = Number(options)
        if (!Number.isNaN(numericalOptions)) {
            return {
                customIdentifier,
                options: numericalOptions as T,
            }
        }

        switch (options.toLowerCase()) {
            case "true":
                return {
                    customIdentifier,
                    options: true as T,
                }
            case "false":
                return {
                    customIdentifier,
                    options: false as T,
                }
            default:
                return {
                    customIdentifier,
                    options: JSON.parse(options),
                }
        }
    }
}

export { ComponentCustomIdentifierHandler }
