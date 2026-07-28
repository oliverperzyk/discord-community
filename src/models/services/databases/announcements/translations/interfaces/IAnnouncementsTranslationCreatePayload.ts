import type { DatabaseIdentifier } from "../../../base/types/DatabaseIdentifier"
import type { AnnouncementsTranslationsLanguage } from "../enums/AnnouncementsTranslationsLanguage"

/**
 * @summary The announcements translation create payload interface.
 * @description This interface is used to create an announcements translation.
 */
interface IAnnouncementsTranslationCreatePayload {
    /**
     * @summary The announcement ID.
     * @description The announcement ID, the announcement that is being translated.
     */
    readonly announcementId: DatabaseIdentifier
    /**
     * @summary The language.
     * @description The language, the language of the translation.
     */
    readonly language: AnnouncementsTranslationsLanguage
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

export type { IAnnouncementsTranslationCreatePayload }
