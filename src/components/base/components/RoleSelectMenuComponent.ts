import { BaseComponent } from "../common/BaseComponent"
import type { RoleSelectMenuInteraction } from "discord.js"

/**
 * @summary Base class for all role select menu components.
 * @description This class is the base class for all role select menu components.
 * @template Properties - Specifies `props` param type in `onInteract` method. It gets properties from query part from custom identifier.
 */
abstract class RoleSelectMenuComponent<Properties = undefined> extends BaseComponent<
    RoleSelectMenuInteraction,
    Properties
> {}

export { RoleSelectMenuComponent }
