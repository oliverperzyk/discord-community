import type { ClientEvents } from "discord.js"
import { BaseEventListener } from "./BaseEventListener"
import { DiscordApplicationInstanceManager } from "@/oliverperzyk/globals/managers/DiscordApplicationInstanceManager"

/**
 * @summary Registry of event listeners.
 * @description This class is used to register event listeners to the Discord API.
 */
class EventListenerRegistry {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}
    /**
     * @summary The event listeners to register.
     * @description The event listeners to register to the Discord API.
     */
    private static readonly EVENT_LISTENERS: readonly BaseEventListener<keyof ClientEvents>[] = []
    /**
     * @summary Whether the event listeners are initialized.
     * @description Whether the event listeners are initialized already.
     */
    private static isInitialized: boolean = false

    /**
     * @summary Initialize the event listeners.
     * @description Initialize the event listeners and register them to the Discord API.
     */
    public static async initializeEventListeners(): Promise<void> {
        if (this.isInitialized) return
        this.isInitialized = true
        DiscordApplicationInstanceManager.instance.setMaxListeners(this.EVENT_LISTENERS.length)

        for (const eventListener of this.EVENT_LISTENERS) {
            if (eventListener.ENABLE_ON_LISTENER) {
                DiscordApplicationInstanceManager.instance.on(eventListener.eventName, (...eventData) => {
                    eventListener.onEvent(...eventData)
                })
            }

            if (eventListener.ENABLE_ONCE_LISTENER) {
                DiscordApplicationInstanceManager.instance.once(eventListener.eventName, (...eventData) => {
                    eventListener.onceEvent(...eventData)
                })
            }
        }
    }
}

export { EventListenerRegistry }
