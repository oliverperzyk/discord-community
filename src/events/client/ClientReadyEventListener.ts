import { type Client, Events, ActivityType } from "discord.js"
import { BaseEventListener } from "../base/BaseEventListener"
import { SlashCommandRegistry } from "@/oliverperzyk/commands/base/SlashCommandRegistry"

/**
 * @summary Event listener for the client ready event.
 * @description This class is used to register the client ready event listener.
 */
class ClientReadyEventListener extends BaseEventListener<Events.ClientReady> {
    /**
     * @summary The name of the event.
     * @description The name of the event.
     */
    public readonly eventName: Events.ClientReady = Events.ClientReady
    /**
     * @summary Whether the event listener should be enabled on the listener.
     * @description Whether the event listener should be executed on the event & registered to the Discord API.
     */
    public override readonly ENABLE_ON_LISTENER: boolean = false
    /**
     * @summary Whether the event listener should be executed once on the event & registered to the Discord API.
     * @description Whether the event listener should be executed once on the event & registered to the Discord API.
     */
    public override readonly ENABLE_ONCE_LISTENER: boolean = true

    /**
     * @summary Listener's behavior.
     * @description Method is triggered once the client is ready.
     */
    public override async onceEvent(client: Client<true>): Promise<void> {
        await client.user.setActivity({
            name: "🍪 eating cookies...",
            type: ActivityType.Custom,
        })
        await SlashCommandRegistry.registerCommands()
    }
}

export { ClientReadyEventListener }
