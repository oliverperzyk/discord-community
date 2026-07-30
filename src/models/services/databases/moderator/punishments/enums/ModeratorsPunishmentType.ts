/**
 * @summary The moderators punishment type enum.
 * @description This enum is used to store the type of the punishment.
 */
const enum ModeratorsPunishmentType {
    /**
     * @summary The warning type.
     * @description The warning type, does not remove any roles or permissions from the user.
     */
    WARNING = "WARNING",
    /**
     * @summary The timeout type.
     * @description The timeout type. mutes an user for a certain amount of time.
     */
    TIMEOUT = "TIMEOUT",
    /**
     * @summary The kick type.
     * @description The kick type, kicks an user from the server.
     */
    KICK = "KICK",
    /**
     * @summary The ban type.
     * @description The ban type, removes the user from the server and deletes their messages.
     */
    BAN = "BAN",
}

export { ModeratorsPunishmentType }
