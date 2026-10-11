import { ComponentCustomIdentifierHandler } from "@/oliverperzyk/components/base/common/ComponentCustomIdentifierHandler"
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
import { SocialInformation } from "../../SocialInformation"

/**
 * @summary Builders for verification messages.
 * @description Constructs Components V2 verification messages in English.
 */
class VerificationMessages {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary Get the verification message.
     * @description Builds the persistent verification Container in English.
     * @returns The verification message container.
     */
    public static getVerificationMessage(): ContainerBuilder {
        return new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("# 🍪 Welcome"),
                new TextDisplayBuilder().setContent(
                    "This server is a community, just for friends & their friends. As because I do not let everyone slide in, you must verify before you _might_ get access to other channels here.",
                ),
                new TextDisplayBuilder().setContent(
                    "I'd rather know who join this server, than accept everyone. You can find my other Discord servers related to my projects the link below.",
                ),
            )
            .addActionRowComponents(
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setEmoji({ name: "💬" })
                        .setLabel("Other Servers")
                        .setStyle(ButtonStyle.Link)
                        .setURL(SocialInformation.COMMUNITIES_LIST_LINK.toString()),
                    new ButtonBuilder()
                        .setEmoji({ name: "✅" })
                        .setLabel("Verify")
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId(ComponentCustomIdentifierHandler.resolveCustomIdentifier("verify")),
                ),
            )
    }

    /**
     * @summary Get the verification requests message.
     * @description Builds the persistent verification requests Container in English for the given page.
     * @param page - The page number.
     * @returns The verification requests message container.
     */
    public static async getVerificationRequestsMessage(page: number): Promise<ContainerBuilder> {
        const verificationRequests: IPaginationResult<IVerificationRequest> =
            await VerificationRequestsService.getVerificationRequestsByPage(page)
        const totalPages: number = VerificationRequestsService.getTotalPages(verificationRequests.totalCount)

        if (verificationRequests.totalCount === 0) {
            return new ContainerBuilder().addTextDisplayComponents(
                new TextDisplayBuilder().setContent("# ✅ Verification Requests"),
                new TextDisplayBuilder().setContent(
                    "# ✅ No verification requests found, yet. Make sure that the verification is enabled and that the verification role is set.",
                ),
            )
        }

        const container: ContainerBuilder = new ContainerBuilder().addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`# ✅ Verification Requests (${page}/${totalPages})`),
            new TextDisplayBuilder().setContent(
                `There are ${verificationRequests.totalCount} verification request(s) in total.`,
            ),
        )

        for (let i: number = 0; i < verificationRequests.items.length; i++) {
            const verificationRequest: IVerificationRequest = verificationRequests.items[i]
            container.addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `- <@${verificationRequest.userId}> has requested verification on <t:${Math.floor(verificationRequest.createdAt.getTime() / 1000)}:R>.`,
                        ),
                    )
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setEmoji({
                                name: "✏️",
                            })
                            .setLabel("Manage")
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
                    .setLabel("Previous Page")
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
                    .setLabel("Next Page")
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
