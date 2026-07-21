import { BaseComponent } from "../common/BaseComponent"
import type { StringSelectMenuInteraction } from "discord.js"

/**
 * @summary Base class for all string select menu components.
 * @description This class is the base class for all string select menu components.
 * @template Properties - Specifies `props` param type in `onInteract` method. It gets properties from query part from custom identifier.
 */
abstract class StringSelectMenuComponent<Properties = undefined> extends BaseComponent<
    StringSelectMenuInteraction,
    Properties
> {}

export { StringSelectMenuComponent }
