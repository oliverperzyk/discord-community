/**
 * @summary The giveaways translation update payload interface.
 * @description This interface is used to update a giveaways translation.
 */
interface IGiveawaysTranslationUpdatePayload {
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
    /**
     * @summary The prize.
     * @description The prize, the prize of the translation.
     */
    readonly prize: string
}

export type { IGiveawaysTranslationUpdatePayload }
