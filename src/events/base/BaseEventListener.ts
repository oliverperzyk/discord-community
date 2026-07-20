import type { ClientEvents } from "discord.js"

/**
 * @summary Base class for all event listeners.
 * @description This class is the base class for all event listeners.
 */
abstract class BaseEventListener<T extends keyof ClientEvents> {
    /**
     * @summary The name of the event.
     * @description The name of the event.
     */
    public abstract readonly eventName: T
    /**
     * @summary Whether the event listener should be enabled on the listener.
     * @description Whether the event listener should be executed on the event & registered to the Discord API.
     */
    public readonly ENABLE_ON_LISTENER: boolean = true
    /**
     * @summary Whether the event listener should be executed once on the event & registered to the Discord API.
     * @description Whether the event listener should be executed once on the event & registered to the Discord API.
     */
    public readonly ENABLE_ONCE_LISTENER: boolean = false

    /**
     * @summary The function to execute when the event is triggered.
     * @description Override this method to execute the event listener, if you enabled "on" listener.
     */
    public onEvent(..._eventData: ClientEvents[T]): void {}
    /**
     * @summary The function to execute when the event is triggered.
     * @description Override this method to execute the event listener, if you enabled "once" listener.
     */
    public onceEvent(..._eventData: ClientEvents[T]): void {}
}

export { BaseEventListener }
