import { BaseComponentRegister } from "./BaseComponentRegister"
import { StringSelectMenuComponent } from "../components/StringSelectMenuComponent"

/**
 * @summary Register for all string select menu components.
 * @description This register is used to register all string select menu components.
 */
class StringSelectMenuComponentRegister extends BaseComponentRegister {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary The components of the register.
     * @description The components of the register.
     * @remarks The components of the register are all string select menu components.
     */
    protected static override readonly COMPONENTS: StringSelectMenuComponent<unknown>[] = []

    /**
     * @summary Get a component by its custom identifier.
     * @description Get a component by its custom identifier.
     * @param customIdentifier - The custom identifier of the component.
     * @returns The component or `null` if not found.
     */
    public static override getComponentByCustomIdentifier<Properties = undefined>(
        customIdentifier: string,
    ): StringSelectMenuComponent<Properties> | null {
        return super.getComponentByCustomIdentifier(customIdentifier) as StringSelectMenuComponent<Properties> | null
    }
}

export { StringSelectMenuComponentRegister }
