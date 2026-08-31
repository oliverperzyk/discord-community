import { ComponentCustomIdentifierHandler } from "@/oliverperzyk/components/base/common/ComponentCustomIdentifierHandler"
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { IPaginationResult } from "@/oliverperzyk/models/services/databases/base/interfaces/IPaginationResult"
import { IVerificationRequest } from "@/oliverperzyk/models/services/databases/verification/requests/interfaces/IVerificationRequest"
import { VerificationRequestsService } from "@/oliverperzyk/services/databases/verification/VerificationRequestsService"
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
} from "discord.js"
import { ReusableComponents } from "../ReusableComponents"

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
                .setButtonAccessory(ReusableComponents.translateButton(language, "verification-message")),
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

    /**
     * @summary Get the verification requests message.
     * @description Builds the persistent verification requests Container for the given language and page.
     * @param language - The language to render the message in.
     * @param page - The page number.
     * @returns The verification requests message container.
     */
    public static async getVerificationRequestsMessage(language: Language, page: number): Promise<ContainerBuilder> {
        const verificationRequests: IPaginationResult<IVerificationRequest> =
            await VerificationRequestsService.getVerificationRequestsByPage(page)
        const totalPages: number = VerificationRequestsService.getTotalPages(verificationRequests.totalCount)

        if (verificationRequests.totalCount === 0) {
            return new ContainerBuilder()
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                "# ✅ " +
                                    TranslationsManager.translate({
                                        key: "container.verification.requests.title-no-requests",
                                        language,
                                    }),
                            ),
                        )
                        .setButtonAccessory(ReusableComponents.translateButton(language, "verification-requests")),
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        "# ✅ " +
                            TranslationsManager.translate({
                                key: "container.verification.requests.no-requests",
                                language,
                            }),
                    ),
                )
        }

        const container: ContainerBuilder = new ContainerBuilder().addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                "# ✅ " +
                    TranslationsManager.translate({
                        key: "container.verification.requests.title",
                        language,
                        data: {
                            page,
                            totalPages,
                        },
                    }),
            ),
            new TextDisplayBuilder().setContent(
                TranslationsManager.translate({
                    key: "container.verification.requests.page-info",
                    language,
                    data: {
                        totalCount: verificationRequests.totalCount,
                    },
                }),
            ),
        )

        for (let i: number = 0; i < verificationRequests.items.length; i++) {
            const verificationRequest: IVerificationRequest = verificationRequests.items[i]
            container.addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            TranslationsManager.translate({
                                key: "container.verification.requests.request",
                                language,
                                data: {
                                    user: verificationRequest.userId,
                                    timestamp: Math.floor(verificationRequest.createdAt.getTime() / 1000),
                                },
                            }),
                        ),
                    )
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setEmoji({
                                name: "✏️",
                            })
                            .setLabel(
                                TranslationsManager.translate({
                                    key: "common.manage",
                                    language,
                                }),
                            )
                            .setCustomId(
                                ComponentCustomIdentifierHandler.resolveCustomIdentifier("manage-verification", {
                                    id: verificationRequest.id,
                                }),
                            )
                            .setStyle(ButtonStyle.Primary),
                    ),
            )

            if (i < verificationRequests.items.length - 1) {
                container.addSeparatorComponents(
                    new SeparatorBuilder().setDivider(false).setSpacing(SeparatorSpacingSize.Small),
                )
            }
        }

        container.addActionRowComponents(
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setEmoji({
                        name: "⬅️",
                    })
                    .setLabel(
                        TranslationsManager.translate({
                            key: "common.previous-page",
                            language,
                        }),
                    )
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 1)
                    .setCustomId(
                        ComponentCustomIdentifierHandler.resolveCustomIdentifier("verification-requests", {
                            page: page - 1,
                            a: "previous",
                        }),
                    ),
                new ButtonBuilder()
                    .setEmoji({
                        name: "➡️",
                    })
                    .setLabel(
                        TranslationsManager.translate({
                            key: "common.next-page",
                            language,
                        }),
                    )
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === totalPages)
                    .setCustomId(
                        ComponentCustomIdentifierHandler.resolveCustomIdentifier("verification-requests", {
                            page: page + 1,
                            a: "next",
                        }),
                    ),
            ),
        )

        return container
    }
}

export { VerificationMessages }
