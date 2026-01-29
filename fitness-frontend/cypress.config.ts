export default {
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: '../cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: '../cypress/support/e2e.js',
    fixturesFolder: '../cypress/fixtures',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
