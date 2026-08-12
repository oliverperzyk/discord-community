import { IBaseEntity } from "../../../base/interfaces/IBaseEntity"
import type { DatabaseIdentifier } from "../../../base/types/DatabaseIdentifier"
import type { Language } from "../../../base/enums/Language"

/**
 * @summary The announcements translation interface.
 * @description This interface is used to store the announcements translation.
 */
interface IAnnouncementsTranslation extends IBaseEntity {
    /**
     * @summary The announcement ID.
     * @description The announcement ID, the announcement that is being translated.
     */
    readonly announcementId: DatabaseIdentifier
    /**
     * @summary The language.
     * @description The language, the language of the translation.
     */
    readonly language: Language
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

export type { IAnnouncementsTranslation }
