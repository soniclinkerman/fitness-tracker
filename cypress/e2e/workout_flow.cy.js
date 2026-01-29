describe("Smoke test", () => {
    it("loads the app", () => {
        cy.visit("http://localhost:5173");
        cy.contains("Workout").should("exist");
    });
});