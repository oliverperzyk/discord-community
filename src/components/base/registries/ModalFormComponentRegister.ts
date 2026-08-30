import { BaseComponentRegister } from "./BaseComponentRegister"
import { ModalFormComponent } from "../components/ModalFormComponent"
import { VerificationSettingsModalFormComponent } from "../../modals/private/verification/VerificationSettingsModalFormComponent"
import { VerificationModalFormComponent } from "../../modals/private/verification/VerificationModalFormComponent"

/**
 * @summary Register for all modal form components.
 * @description This register is used to register all modal form components.
 */
class ModalFormComponentRegister extends BaseComponentRegister {
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
     * @remarks The components of the register are all modal form components.
     */
    protected static override readonly COMPONENTS: ModalFormComponent<unknown>[] = [
        // Verification-related modals.
        new VerificationSettingsModalFormComponent(),
        new VerificationModalFormComponent(),
    ]

    /**
     * @summary Get a component by its custom identifier.
     * @description Get a component by its custom identifier.
     * @param customIdentifier - The custom identifier of the component.
     * @returns The component or `null` if not found.
     */
    public static override getComponentByCustomIdentifier<Properties = undefined>(
        customIdentifier: string,
    ): ModalFormComponent<Properties> | null {
        return super.getComponentByCustomIdentifier(customIdentifier) as ModalFormComponent<Properties> | null
    }
}

export { ModalFormComponentRegister }
