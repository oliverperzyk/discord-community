import { ModalFormComponent } from "@/oliverperzyk/components/base/components/ModalFormComponent"
import { DiscordApplicationInstanceManager } from "@/oliverperzyk/globals/managers/DiscordApplicationInstanceManager"
import { TranslationsManager } from "@/oliverperzyk/globals/managers/TranslationsManager"
import { DiscordSnowflakeDataManager } from "@/oliverperzyk/globals/managers/data/base/DiscordSnowflakeDataManager"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import type { IManageVerificationRequestModalFormComponentOptions } from "@/oliverperzyk/models/components/modals/private/verification/interfaces/IManageVerificationRequestModalFormComponentOptions"
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { VerificationRequestState } from "@/oliverperzyk/models/services/databases/verification/requests/enums/VerificationRequestState"
import type { IVerificationState } from "@/oliverperzyk/models/services/databases/verification/state/interfaces/IVerificationState"
import { VerificationRequestsService } from "@/oliverperzyk/services/databases/verification/VerificationRequestsService"
import { VerificationStateService } from "@/oliverperzyk/services/databases/verification/VerificationStateService"
import {
    type Guild,
    type GuildMember,
    MessageFlags,
    type ModalSubmitInteraction,
    ContainerBuilder,
    TextDisplayBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js"

/**
 * @summary The manage verification request modal form component.
 * @description The manage verification request modal form component.
 */
class ManageVerificationRequestModalFormComponent extends ModalFormComponent<IManageVerificationRequestModalFormComponentOptions> {
    /**
     * @summary The custom identifier of the component.
     * @description The custom identifier of the component.
     */
    public readonly customIdentifier: string = "manage-verification-request"

    /**
     * @summary The method to handle the modal submit interaction.
     * @description The method to handle the modal submit interaction.
     * @param interaction - The modal submit interaction.
     * @param options - The options for the modal form component.
     */
    public async onInteract(
        interaction: ModalSubmitInteraction,
        { id }: Readonly<IManageVerificationRequestModalFormComponentOptions>,
    ): Promise<void> {
        const language: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
        const verificationRequest = await VerificationRequestsService.getVerificationRequestById(id)
        if (!verificationRequest) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                content: TranslationsManager.translateMarkdown({
                    file: "ErrorManageVerifcationRequestNotFound",
                    language,
                }),
            })
            return
        }

        const action: "accept" | "reject" = interaction.fields.getStringSelectValues("action")[0] as "accept" | "reject"
        const comment: string = interaction.fields.getTextInputValue("comment")
        await VerificationRequestsService.updateVerificationRequest(id, {
            state: action === "accept" ? VerificationRequestState.ACCEPTED : VerificationRequestState.REJECTED,
            moderatorComment: comment,
            reviewedByUserId: DiscordSnowflakeDataManager.castToDiscordSnowflake(interaction.user.id),
        })

        const guild: Guild = await DiscordApplicationInstanceManager.instance.guilds.fetch(verificationRequest.guildId)
        if (action === "accept") {
            try {
                const verificationState: IVerificationState | null =
                    await VerificationStateService.getVerificationStateByGuildId(
                        DiscordSnowflakeDataManager.castToDiscordSnowflake(guild.id),
                    )
                const member: GuildMember = await guild.members.fetch(verificationRequest.userId)
                if (member && verificationState?.roleId) {
                    await member.roles.add(verificationState.roleId)
                }
            } catch {
                // Do nothing.
            }
        }

        await DiscordApplicationInstanceManager.sendMessageToUser(verificationRequest.userId, {
            flags: [MessageFlags.IsComponentsV2],
            components: [
                new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            TranslationsManager.translateMarkdown({
                                file:
                                    action === "accept"
                                        ? "DirectMessageVerificationAcceptedRequest"
                                        : "DirectMessageVerificationRejectedRequest",
                                language,
                                data: {
                                    moderatorUserId: DiscordSnowflakeDataManager.castToDiscordSnowflake(
                                        interaction.user.id,
                                    ),
                                    note: comment,
                                },
                            }),
                        ),
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>().setComponents(
                            new ButtonBuilder()
                                .setLabel(guild.name)
                                .setEmoji({
                                    name: "🔗",
                                })
                                .setURL(`https://discord.com/channels/${guild.id}`)
                                .setStyle(ButtonStyle.Link),
                        ),
                    ),
            ],
        })

        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            content: TranslationsManager.translateMarkdown({
                file: "ManageVerificationRequestResolved",
                language,
            }),
        })
    }
}

export { ManageVerificationRequestModalFormComponent }
