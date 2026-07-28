/**
 * @summary The announcements translation update payload interface.
 * @description This interface is used to update an announcements translation.
 */
interface IAnnouncementsTranslationUpdatePayload {
    /**
     * @summary The title.
     * @description The title, the title of the translation.
     */
    readonly title: string
    /**
     * @summary The content.
     * @description The content, the content of the translation.
     */
    readonly content: string
}

export type { IAnnouncementsTranslationUpdatePayload }
