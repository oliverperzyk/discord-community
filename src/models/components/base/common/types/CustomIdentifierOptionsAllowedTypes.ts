type CustomIdentifierOptionsAllowedTypes =
    | string
    | number
    | boolean
    | unknown[]
    | {
          [value: string]: string | number | boolean
      }

export type { CustomIdentifierOptionsAllowedTypes }
