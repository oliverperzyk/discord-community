import type { CustomIdentifierOptionsAllowedTypes } from "../types/CustomIdentifierOptionsAllowedTypes"

interface IParsedRawCustomIdentifier<T extends CustomIdentifierOptionsAllowedTypes> {
    readonly customIdentifier: string
    readonly options?: Readonly<T>
}

export type { IParsedRawCustomIdentifier }
