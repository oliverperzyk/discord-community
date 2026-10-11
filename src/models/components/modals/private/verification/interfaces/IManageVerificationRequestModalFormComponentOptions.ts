import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"

/**
 * @summary The options for the manage verification request modal form component.
 * @description The options for the manage verification request modal form component.
 */
interface IManageVerificationRequestModalFormComponentOptions {
    /**
     * @summary The ID of the verification request.
     * @description The ID of the verification request that is being managed.
     */
    readonly id: DatabaseIdentifier
}

export { IManageVerificationRequestModalFormComponentOptions }
