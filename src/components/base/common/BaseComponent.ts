import type { Interaction } from "discord.js"

/**
 * @summary Base class for all components.
 * @description This class is the base class for all components, e.g. buttons, modal forms, dropdowns, etc.
 * @template InteractionType - Specifies `interaction` param type in `onInteract` method.
 * @template Properties - Specifies `props` param type in `onInteract` method. It gets properties from query part from custom identifier.
 */
abstract class BaseComponent<InteractionType extends Interaction, Properties = undefined> {
    /**
     * @summary The custom identifier of the component.
     * @description The custom identifier of the component, that allows to make every single component unique.
     * @remarks This field does not include query options at all.
     */
    public abstract readonly customIdentifier: string

    /**
     * @summary The function to execute when the component is invoked.
     * @description The function to execute when the component is invoked.
     * @param interaction - The interaction that triggered the component.
     * @param props - Properties of this certain component.
     * @returns The result of the component interaction.
     */
    public abstract onInteract(interaction: InteractionType, props: Properties): unknown
}

export { BaseComponent }
