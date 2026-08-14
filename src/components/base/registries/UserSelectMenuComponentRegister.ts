import { BaseComponentRegister } from "./BaseComponentRegister"
import { UserSelectMenuComponent } from "../components/UserSelectMenuComponent"

/**
 * @summary Register for all user select menu components.
 * @description This register is used to register all user select menu components.
 */
class UserSelectMenuComponentRegister extends BaseComponentRegister {
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
     * @remarks The components of the register are all user select menu components.
     */
    protected static override readonly COMPONENTS: UserSelectMenuComponent<unknown>[] = []

    /**
     * @summary Get a component by its custom identifier.
     * @description Get a component by its custom identifier.
     * @param customIdentifier - The custom identifier of the component.
     * @returns The component or `null` if not found.
     */
    public static override getComponentByCustomIdentifier<Properties = undefined>(
        customIdentifier: string,
    ): UserSelectMenuComponent<Properties> | null {
        return super.getComponentByCustomIdentifier(customIdentifier) as UserSelectMenuComponent<Properties> | null
    }
}

export { UserSelectMenuComponentRegister }
