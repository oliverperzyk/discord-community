import { BaseComponent } from "../common/BaseComponent"
import type { ModalSubmitInteraction } from "discord.js"

/**
 * @summary Base class for all modal form components.
 * @description This class is the base class for all modal form components.
 * @template Properties - Specifies `props` param type in `onInteract` method. It gets properties from query part from custom identifier.
 */
abstract class ModalFormComponent<Properties = undefined> extends BaseComponent<ModalSubmitInteraction, Properties> {}

export { ModalFormComponent }
