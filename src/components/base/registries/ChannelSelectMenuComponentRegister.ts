import { BaseComponentRegister } from "./BaseComponentRegister"
import { ChannelSelectMenuComponent } from "../components/ChannelSelectMenuComponent"

/**
 * @summary Register for all channel select menu components.
 * @description This register is used to register all channel select menu components.
 */
class ChannelSelectMenuComponentRegister extends BaseComponentRegister {
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
     * @remarks The components of the register are all channel select menu components.
     */
    protected static override readonly COMPONENTS: ChannelSelectMenuComponent<unknown>[] = []

    /**
     * @summary Get a component by its custom identifier.
     * @description Get a component by its custom identifier.
     * @param customIdentifier - The custom identifier of the component.
     * @returns The component or `null` if not found.
     */
    public static override getComponentByCustomIdentifier<Properties = undefined>(
        customIdentifier: string,
    ): ChannelSelectMenuComponent<Properties> | null {
        return super.getComponentByCustomIdentifier(customIdentifier) as ChannelSelectMenuComponent<Properties> | null
    }
}

export { ChannelSelectMenuComponentRegister }
