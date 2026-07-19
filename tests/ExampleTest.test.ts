import { describe, it, expect } from "bun:test"

/**
 * @summary Temporary test for workflow.
 * @description This test is only to not interrupt CI workflow while testing the application.
 * @remarks Delete this test as soon, as there'll be other tests.
 */
describe("Temporary test.", (): void => {
    it("should equal", () => {
        expect(2).toEqual(2)
    })
})