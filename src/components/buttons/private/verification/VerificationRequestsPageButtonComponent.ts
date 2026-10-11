import { ButtonComponent } from "@/oliverperzyk/components/base/components/ButtonComponent"
import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { VerificationMessages } from "@/oliverperzyk/globals/messages/verification/VerificationMessages"
import type { IVerificationRequestsPageButtonComponentOptions } from "@/oliverperzyk/models/components/buttons/private/verification/requests/interfaces/IVerificationRequestsPageButtonComponentOptions"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { type ButtonInteraction, type InteractionUpdateOptions, MessageFlags } from "discord.js"

/**
 * @summary Verification requests page button component.
 * @description Paginates the verification requests message when previous or next is pressed.
 */
class VerificationRequestsPageButtonComponent extends ButtonComponent<IVerificationRequestsPageButtonComponentOptions> {
    /**
     * @summary The custom identifier of the button.
     * @description The custom identifier of the button.
     */
    public readonly customIdentifier: string = "verification-requests"

    /**
     * @summary Handle page button interaction.
     * @description Updates the verification requests message, including when the original reply is ephemeral.
     * @param interaction - The button interaction.
     * @param options - The page options parsed from the custom identifier.
     */
    public async onInteract(
        interaction: ButtonInteraction,
        { page }: Readonly<IVerificationRequestsPageButtonComponentOptions>,
    ): Promise<void> {
        const language: Language = await LanguageDataManager.resolveLanguageByInteraction(interaction)
        const payload: InteractionUpdateOptions = {
            flags: [MessageFlags.IsComponentsV2],
            components: [await VerificationMessages.getVerificationRequestsMessage(language, page)],
        }

        if (interaction.message.flags.has(MessageFlags.Ephemeral) || !interaction.message.editable) {
            await interaction.update(payload)
            return
        }

        await interaction.message.edit(payload)
        await interaction.deferUpdate()
    }
}

export { VerificationRequestsPageButtonComponent }
