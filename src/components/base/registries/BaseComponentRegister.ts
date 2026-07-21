import type { ISlicedBaseComponent } from "@/oliverperzyk/models/components/base/registries/interfaces/ISlicedBaseComponent"

/**
 * @summary Base class for all component registers.
 * @description This class is the base class for all component registers.
 */
abstract class BaseComponentRegister {
    /**
     * @summary Protected constructor.
     * @description Protected constructor to prevent instantiation, while allowing inheritance.
     */
    protected constructor() {}

    /**
     * @summary The components of the register.
     * @description The components of the register.
     * @remarks Only `customIdentifier` is required for lookup. Avoiding `BaseComponent<Interaction, …>`
     * here keeps specialized components assignable despite `onInteract` contravariance.
     */
    protected static readonly COMPONENTS: ISlicedBaseComponent[] = []

    /**
     * @summary Get a component by its custom identifier.
     * @description Get a component by its custom identifier.
     * @param customIdentifier - The custom identifier of the component.
     * @returns The component or `null` if not found.
     */
    public static getComponentByCustomIdentifier(customIdentifier: string): ISlicedBaseComponent | null {
        return (
            this.COMPONENTS.find(
                ({ customIdentifier: componentCustomIdentifier }) => componentCustomIdentifier === customIdentifier,
            ) ?? null
        )
    }
}

export { BaseComponentRegister }
