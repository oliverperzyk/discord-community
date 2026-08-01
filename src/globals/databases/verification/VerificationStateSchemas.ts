import { boolean } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"

/**
 * @summary Table for the verification state.
 * @description Table for the verification state, used to store the verification state for the verification process.
 */
const verificationStateTable = baseTable("verification_state", {
    enabled: boolean("state").notNull().default(false),
})

export { verificationStateTable }
