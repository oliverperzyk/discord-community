import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"

/**
 * @summary Options for the manage verification request button component.
 * @description This interface is used to define the options for the manage verification request button component.
 */
interface IManageVerificationRequestButtonComponentOptions {
    /**
     * @summary The ID of the verification request.
     * @description The ID of the verification request.
     */
    readonly id: DatabaseIdentifier
}

export type { IManageVerificationRequestButtonComponentOptions }
