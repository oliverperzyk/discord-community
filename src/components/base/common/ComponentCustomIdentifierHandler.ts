import type { IParsedRawCustomIdentifier } from "@/oliverperzyk/models/components/base/common/interfaces/IParsedRawCustomIdentifier"
import type { CustomIdentifierOptionsAllowedTypes } from "@/oliverperzyk/models/components/base/common/types/CustomIdentifierOptionsAllowedTypes"

class ComponentCustomIdentifierHandler {
    private constructor() {}

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
