// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Backend API URL (Rails server)
const API_URL = 'http://localhost:3000';

// Reset workout sessions before each test to ensure clean state
beforeEach(() => {
  cy.request({
    method: 'POST',
    url: `${API_URL}/test/reset_workout_sessions`,
    failOnStatusCode: false, // Don't fail if endpoint doesn't exist
  }).then((response) => {
    if (response.status === 200) {
      cy.log('Workout sessions reset successfully');
    } else {
      cy.log('Could not reset workout sessions - endpoint may not be available');
    }
  });
});