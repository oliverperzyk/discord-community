import { ComponentCustomIdentifierHandler } from "@/oliverperzyk/components/base/common/ComponentCustomIdentifierHandler"
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    SectionBuilder,
    TextDisplayBuilder,
} from "discord.js"

/**
 * @summary Builders for verification messages.
 * @description Constructs Components V2 verification messages for a given language.
 */
class VerificationMessages {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Split Markdown into paragraph blocks.
     * @description Splits Markdown on blank lines so each block can be its own Text Display.
     * @param content - The Markdown content to split.
     * @returns The non-empty paragraph blocks.
     */
    private static splitMarkdownParagraphs(content: string): string[] {
        return content
            .trim()
            .split(/\n{2,}/)
            .map((paragraph: string): string => paragraph.trim())
            .filter((paragraph: string): boolean => paragraph.length > 0)
    }

    /**
     * @summary Get the verification message.
     * @description Builds the persistent verification Container for the given language.
     * @param language - The language to render the message in.
     * @returns The verification message container.
     */
    public static getVerificationMessage(language: Language): ContainerBuilder {
        const paragraphs: string[] = this.splitMarkdownParagraphs(
            TranslationsManager.translateMarkdown({
                file: "VerificationMessage.md",
                language,
            }),
        )
        const heading: string = paragraphs[0] ?? ""
        const bodyParagraphs: string[] = paragraphs.slice(1)

        const container: ContainerBuilder = new ContainerBuilder().addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(new TextDisplayBuilder().setContent(heading))
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setEmoji({ name: "🌐" })
                        .setLabel(
                            TranslationsManager.translate({
                                key: "verification.interaction.translate",
                                language,
                            }),
                        )
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId(
                            ComponentCustomIdentifierHandler.resolveCustomIdentifier("translate", {
                                m: "verification-message",
                            }),
                        ),
                ),
        )

        if (bodyParagraphs.length > 0) {
            container.addTextDisplayComponents(
                ...bodyParagraphs.map(
                    (paragraph: string): TextDisplayBuilder => new TextDisplayBuilder().setContent(paragraph),
                ),
            )
        }

        return container
            .addActionRowComponents(
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setEmoji({ name: "💬" })
                        .setLabel(
                            TranslationsManager.translate({
                                key: "verification.interaction.other-servers",
                                language,
                            }),
                        )
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.oliverperzyk.com"),
                    new ButtonBuilder()
                        .setEmoji({ name: "✅" })
                        .setLabel(
                            TranslationsManager.translate({
                                key: "verification.interaction.verify",
                                language,
                            }),
                        )
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(ComponentCustomIdentifierHandler.resolveCustomIdentifier("verify")),
                ),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    "-# " +
                        TranslationsManager.translate({
                            key: "verification.sidenote",
                            language,
                        }),
                ),
            )
    }
}

export { VerificationMessages }
