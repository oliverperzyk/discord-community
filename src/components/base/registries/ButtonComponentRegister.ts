import { BaseComponentRegister } from "./BaseComponentRegister"
import { ButtonComponent } from "../components/ButtonComponent"
import { TranslateButtonComponent } from "../../buttons/general/TranslateButtonComponent"
import { VerifyButtonComponent } from "../../buttons/verification/VerifyButtonComponent"

/**
 * @summary Register for all button components.
 * @description This register is used to register all button components.
 */
class ButtonComponentRegister extends BaseComponentRegister {
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
     * @remarks The components of the register are all button components.
     */
    protected static override readonly COMPONENTS: ButtonComponent<unknown>[] = [
        // General buttons.
        new TranslateButtonComponent(),
        // Verification buttons.
        new VerifyButtonComponent(),
    ]

    /**
     * @summary Get a component by its custom identifier.
     * @description Get a component by its custom identifier.
     * @param customIdentifier - The custom identifier of the component.
     * @returns The component or `null` if not found.
     */
    public static override getComponentByCustomIdentifier<Properties = undefined>(
        customIdentifier: string,
    ): ButtonComponent<Properties> | null {
        return super.getComponentByCustomIdentifier(customIdentifier) as ButtonComponent<Properties> | null
    }
}

export { ButtonComponentRegister }
