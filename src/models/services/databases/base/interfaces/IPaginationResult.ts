/**
 * @summary The pagination result interface.
 * @description This interface is used to store the pagination result.
 */
interface IPaginationResult<T> {
    /**
     * @summary The items.
     * @description Items of the current page.
     */
    readonly items: T[]
    /**
     * @summary The total count.
     * @description Total count of items in database that match the filter options.
     */
    readonly totalCount: number
}

export type { IPaginationResult }
