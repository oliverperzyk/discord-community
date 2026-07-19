import { Client, GatewayIntentBits } from "discord.js"
import { EnvironmentVariables } from "../EnvironmentVariables"

/**
 * @summary Manager of Discord's application client.
 * @description This class matches singleton pattern for Discord's application instance.
 */
class DiscordApplicationInstanceManager {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}
    /**
     * @summary Internal instance of Discord's application client.
     */
    private static internalInstance: Client | null = null

    /**
     * @summary Discord's application client.
     * @description Getter method of Discord's application client instance. It's configured already.
     */
    public static get instance(): Client {
        if (!this.internalInstance) {
            this.internalInstance = new Client({
                intents: [
                    GatewayIntentBits.AutoModerationConfiguration,
                    GatewayIntentBits.AutoModerationExecution,
                    GatewayIntentBits.DirectMessagePolls,
                    GatewayIntentBits.DirectMessageReactions,
                    GatewayIntentBits.DirectMessageTyping,
                    GatewayIntentBits.DirectMessages,
                    GatewayIntentBits.GuildExpressions,
                    GatewayIntentBits.GuildIntegrations,
                    GatewayIntentBits.GuildInvites,
                    GatewayIntentBits.GuildMembers,
                    GatewayIntentBits.GuildMessagePolls,
                    GatewayIntentBits.GuildMessageReactions,
                    GatewayIntentBits.GuildMessageTyping,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.GuildModeration,
                    GatewayIntentBits.GuildPresences,
                    GatewayIntentBits.GuildScheduledEvents,
                    GatewayIntentBits.GuildVoiceStates,
                    GatewayIntentBits.GuildWebhooks,
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.MessageContent,
                ],
                rest: {
                    version: "10",
                },
            })
            this.internalInstance.rest.setToken(EnvironmentVariables.DISCORD_TOKEN)
            this.internalInstance.login(EnvironmentVariables.DISCORD_TOKEN)
        }

        return this.internalInstance
    }
}

export { DiscordApplicationInstanceManager }
