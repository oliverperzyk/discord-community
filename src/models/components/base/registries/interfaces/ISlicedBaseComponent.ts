/**
 * @summary Interface for sliced base components.
 * @description This interface is used to slice base components into smaller parts.
 */
interface ISlicedBaseComponent {
    /**
     * @summary The custom identifier of the component.
     * @description The custom identifier of the component, that allows to make every single component unique.
     * @remarks This field does not include query options at all.
     */
    readonly customIdentifier: string
}

export { ISlicedBaseComponent }
