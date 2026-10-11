import { ModalFormComponent } from "@/oliverperzyk/components/base/components/ModalFormComponent"
import { DiscordSnowflakeDataManager } from "@/oliverperzyk/globals/managers/data/base/DiscordSnowflakeDataManager"
import type { IVerificationModalFormComponentOptions } from "@/oliverperzyk/models/components/modals/private/verification/interfaces/IVerificationModalFormComponentOptions"
import { VerificationRequestsService } from "@/oliverperzyk/services/databases/verification/VerificationRequestsService"
import { ContainerBuilder, GuildMember, MessageFlags, ModalSubmitInteraction, TextDisplayBuilder } from "discord.js"
class VerificationModalFormComponent extends ModalFormComponent<IVerificationModalFormComponentOptions> {
    /**
     * @summary The custom identifier of the modal form component.
     * @description The custom identifier of the modal form component.
     */
    public readonly customIdentifier: string = "verification"

    /**
     * @summary The duration of the verification timeout.
     * @description The duration of the verification timeout.
     * @remarks It should be set to 5 minutes.
     */
    private static readonly VERIFICATION_TIMEOUT_DURATION: number = 1000 * 60 * 5

    /**
     * @summary The function to be called when the modal form component is interacted with.
     * @description This function is used to handle the interaction with the modal form component.
     * @param interaction - The interaction that triggered the modal form component.
     */
    public async onInteract(
        interaction: ModalSubmitInteraction,
        { result }: Readonly<IVerificationModalFormComponentOptions>,
    ): Promise<void> {
        const guildId: string | null = interaction.guildId
        if (!DiscordSnowflakeDataManager.isDiscordSnowflake(guildId)) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        "Looks like you're not in a guild. Please use this command in a guild.",
                    ),
                ],
            })
            return
        }

        const acceptVerificationInput: boolean = interaction.fields.getCheckbox("accept-verification")
        if (!acceptVerificationInput) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder().setContent(
                        "You need to accept the guidelines and conditions of the server, to verify yourself.",
                    ),
                ],
            })
            return
        }

        const resultInput: string = interaction.fields.getTextInputValue("calculation-result")
        const parsedResultInput: number = parseInt(resultInput)
        if (Number.isNaN(parsedResultInput) || parsedResultInput !== result) {
            await interaction.reply({
                flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
                components: [new TextDisplayBuilder().setContent("Invalid result. Please try again later.")],
            })
            if (interaction.member instanceof GuildMember) {
                try {
                    await interaction.member.timeout(
                        VerificationModalFormComponent.VERIFICATION_TIMEOUT_DURATION,
                        "Verification failed.",
                    )
                } catch {
                    // Call might throw an error if the member cannot be timed out.
                    return
                }
            }
            return
        }

        const reasonInput: string = interaction.fields.getTextInputValue("reason")
        await VerificationRequestsService.createVerificationRequest({
            guildId: guildId,
            userId: DiscordSnowflakeDataManager.castToDiscordSnowflake(interaction.user.id),
            comment: reasonInput,
        })
        await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("### ✅ Verification has been successfully submitted"),
                    new TextDisplayBuilder().setContent(
                        "Please wait for the administrator's response, you will receive a notification about the verification result in a private message from me (bot).",
                    ),
                ),
            ],
        })
    }
}

export { VerificationModalFormComponent }
