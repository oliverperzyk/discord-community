import { BaseComponentRegister } from "./BaseComponentRegister"
import { RoleSelectMenuComponent } from "../components/RoleSelectMenuComponent"

/**
 * @summary Register for all role select menu components.
 * @description This register is used to register all role select menu components.
 */
class RoleSelectMenuComponentRegister extends BaseComponentRegister {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {
        super()
    }

    /**
     * @summary The components of the register.
     * @description The components of the register.
     * @remarks The components of the register are all role select menu components.
     */
    protected static override readonly COMPONENTS: RoleSelectMenuComponent<unknown>[] = []

    /**
     * @summary Get a component by its custom identifier.
     * @description Get a component by its custom identifier.
     * @param customIdentifier - The custom identifier of the component.
     * @returns The component or `null` if not found.
     */
    public static override getComponentByCustomIdentifier<Properties = undefined>(
        customIdentifier: string,
    ): RoleSelectMenuComponent<Properties> | null {
        return super.getComponentByCustomIdentifier(customIdentifier) as RoleSelectMenuComponent<Properties> | null
    }
}

export { RoleSelectMenuComponentRegister }
