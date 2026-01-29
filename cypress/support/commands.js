// ***********************************************
// Custom commands for Fitness Tracker E2E tests
// ***********************************************

// Backend API URL
const API_URL = 'http://localhost:3000';

// Command to get element by data-cy attribute
Cypress.Commands.add('getByCy', (selector, ...args) => {
  return cy.get(`[data-cy="${selector}"]`, ...args);
});

// Command to reset all workout sessions
Cypress.Commands.add('resetWorkoutSessions', () => {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/test/reset_workout_sessions`,
    failOnStatusCode: false,
  });
});

// Command to reset entire database (use with caution)
Cypress.Commands.add('resetDatabase', () => {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/test/reset`,
    failOnStatusCode: false,
  });
});

// Command to start a quick workout
Cypress.Commands.add('startQuickWorkout', () => {
  cy.visit('/');
  cy.get('body').then(($body) => {
    if ($body.find('[data-cy="start-quick-workout-card"]').length > 0) {
      cy.get('[data-cy="start-quick-workout-card"]').click();
    } else if ($body.find('[data-cy="active-workout-session-card"]').length > 0) {
      // Resume existing session
      cy.get('[data-cy="active-workout-session-card"]').click();
    } else if ($body.find('[data-cy="next-workout-card-button"]').length > 0) {
      // Start from program
      cy.get('[data-cy="next-workout-card-button"]').click();
    }
  });
  cy.url().should('include', '/workout-sessions/');
});

// Command to navigate to a page
Cypress.Commands.add('navigateTo', (page) => {
  const routes = {
    home: '/',
    exercises: '/exercises',
    programs: '/programs',
    progress: '/workout-history',
  };

  cy.visit(routes[page] || page);
});

// Command to add an exercise to a workout session
Cypress.Commands.add('addExerciseToWorkout', (exerciseName, setCount) => {
  cy.get('[data-cy="add-exercise-btn"]').first().click();
  cy.get('[data-cy="search-exercise-input"]').type(exerciseName);
  cy.contains(exerciseName).click();
  cy.get('[data-cy="set-count-input"]').type(setCount.toString());
  cy.get('[data-cy="add-exercise-btn"]').last().click();
});

// Command to log a set in exercise logging
Cypress.Commands.add('logSet', (reps, weight) => {
  cy.get('[data-cy="logging-reps-input"]').clear().type(reps.toString());
  cy.get('[data-cy="logging-weight-input"]').clear().type(weight.toString());
  cy.get('[data-cy="logging-next-set-btn"]').click();
});

// Command to wait for GraphQL request
Cypress.Commands.add('waitForGraphQL', (operationName) => {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === operationName) {
      req.alias = operationName;
    }
  });
  return cy.wait(`@${operationName}`);
});

// Command to create a new program
Cypress.Commands.add('createProgram', (name, description, days) => {
  cy.visit('/programs');
  cy.get('[data-cy="new-program-btn"]').click();
  cy.get('[data-cy="program-name-input"]').type(name);
  if (description) {
    cy.get('[data-cy="program-description-input"]').type(description);
  }
  cy.get('[data-cy="program-days-input"]').type(days.toString());
  cy.get('[data-cy="program-submit-btn"]').click();
});

// Command to create a new exercise
Cypress.Commands.add('createExercise', (name, description, category) => {
  cy.visit('/exercises');
  cy.get('[data-cy="add-exercise-btn"]').click();
  cy.get('[data-cy="exercise-name-input"]').type(name);
  if (description) {
    cy.get('[data-cy="exercise-description-input"]').type(description);
  }
  if (category) {
    cy.get('[data-cy="exercise-category-select"]').select(category);
  }
  cy.get('[data-cy="exercise-save-btn"]').click();
});
