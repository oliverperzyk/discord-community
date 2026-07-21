import { BaseComponent } from "../common/BaseComponent"
import type { UserSelectMenuInteraction } from "discord.js"

/**
 * @summary Base class for all user select menu components.
 * @description This class is the base class for all user select menu components.
 * @template Properties - Specifies `props` param type in `onInteract` method. It gets properties from query part from custom identifier.
 */
abstract class UserSelectMenuComponent<Properties = undefined> extends BaseComponent<
    UserSelectMenuInteraction,
    Properties
> {}

export { UserSelectMenuComponent }
