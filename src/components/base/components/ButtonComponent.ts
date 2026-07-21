import { BaseComponent } from "../common/BaseComponent"
import type { ButtonInteraction } from "discord.js"

/**
 * @summary Base class for all button components.
 * @description This class is the base class for all button components.
 * @template Properties - Specifies `props` param type in `onInteract` method. It gets properties from query part from custom identifier.
 */
abstract class ButtonComponent<Properties = undefined> extends BaseComponent<ButtonInteraction, Properties> {}

export { ButtonComponent }
