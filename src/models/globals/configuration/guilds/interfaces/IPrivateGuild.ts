/**
 * @summary Represents the private guild configuration.
 * @description This interface is used to store the private guild configuration.
 */
interface IPrivateGuild {
    /**
     * @summary The ID of the guild.
     * @description Discord's identifier for the guild.
     */
    readonly guildId: string
    /**
     * @summary The roles of the guild.
     * @description This object contains the roles of the guild.
     */
    readonly roles: {
        /**
         * @summary The ID of the owner role.
         * @description Discord's identifier for the owner role.
         */
        readonly owner: string
        /**
         * @summary The ID of the best homie role.
         * @description Discord's identifier for the best homie role.
         */
        readonly bestHomie: string
        /**
         * @summary The ID of the big homie role.
         * @description Discord's identifier for the big homie role.
         */
        readonly bigHomie: string
        /**
         * @summary The ID of the nice homie role.
         * @description Discord's identifier for the nice homie role.
         */
        readonly niceHomie: string
        /**
         * @summary The ID of the regular homie role.
         * @description Discord's identifier for the regular homie role.
         */
        readonly regularHomie: string
        /**
         * @summary The ID of the testing things role.
         * @description Discord's identifier for the testing things role.
         */
        readonly testingThings: string
        /**
         * @summary The ID of the giveaways role.
         * @description Discord's identifier for the giveaways role.
         */
        readonly giveaways: string
        /**
         * @summary The ID of the games role.
         * @description Discord's identifier for the games role.
         */
        readonly games: string
    }
    readonly channels: {
        /**
         * @summary The ID of the verification channel.
         * @description Discord's identifier for the verification channel.
         */
        readonly verification: string
        /**
         * @summary The ID of the information channel.
         * @description Discord's identifier for the information channel.
         */
        readonly information: string
        /**
         * @summary The ID of the announcements channel.
         * @description Discord's identifier for the announcements channel.
         */
        readonly announcements: string
        /**
         * @summary The ID of the social posts channel.
         * @description Discord's identifier for the social posts channel.
         */
        readonly socialPosts: string
        /**
         * @summary The ID of the testing things channel.
         * @description Discord's identifier for the testing things channel.
         */
        readonly testingThings: string
        /**
         * @summary The ID of the giveaways channel.
         * @description Discord's identifier for the giveaways channel.
         */
        readonly giveaways: string
        /**
         * @summary The ID of the events channel.
         * @description Discord's identifier for the events channel.
         */
        readonly events: string
        /**
         * @summary The ID of the general channel.
         * @description Discord's identifier for the general channel.
         */
        readonly general: string
        /**
         * @summary The ID of the memes channel.
         * @description Discord's identifier for the memes channel.
         */
        readonly memes: string
        /**
         * @summary The ID of the commands channel.
         * @description Discord's identifier for the commands channel.
         */
        readonly commands: string
        /**
         * @summary The ID of the explanation channel.
         * @description Discord's identifier for the explanation channel.
         */
        readonly explanation: string
        /**
         * @summary The ID of the private channel.
         * @description Discord's identifier for the private channel.
         */
        readonly privateChannel: string
        /**
         * @summary The ID of the first general channel.
         * @description Discord's identifier for the first general channel.
         */
        readonly firstGeneral: string
        /**
         * @summary The ID of the second general channel.
         * @description Discord's identifier for the second general channel.
         */
        readonly secondGeneral: string
        /**
         * @summary The ID of the admin stuff channel.
         * @description Discord's identifier for the admin stuff channel.
         */
        readonly adminStuff: string
        /**
         * @summary The ID of the message trap channel.
         * @description Discord's identifier for the message trap channel.
         */
        readonly messageTrap: string
    }
    readonly categories: {
        /**
         * @summary The ID of the testing things category.
         * @description Discord's identifier for the testing things category.
         */
        readonly testingThings: string
        /**
         * @summary The ID of the tickets category.
         * @description Discord's identifier for the tickets category.
         */
        readonly tickets: string
    }
}

export { IPrivateGuild }
