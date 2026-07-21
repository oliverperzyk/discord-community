import { BaseComponent } from "../common/BaseComponent"
import type { ChannelSelectMenuInteraction } from "discord.js"

/**
 * @summary Base class for all channel select menu components.
 * @description This class is the base class for all channel select menu components.
 * @template Properties - Specifies `props` param type in `onInteract` method. It gets properties from query part from custom identifier.
 */
abstract class ChannelSelectMenuComponent<Properties = undefined> extends BaseComponent<
    ChannelSelectMenuInteraction,
    Properties
> {}

export { ChannelSelectMenuComponent }
