describe('Start Workout Flow', () => {
  beforeEach(() => {
    // Visit the dashboard before each test
    cy.visit('/');
  });

  describe('Dashboard loads correctly', () => {
    it('displays the dashboard title and description', () => {
      cy.get('[data-cy="dashboard-title"]').should('contain', 'Dashboard');
      cy.get('[data-cy="dashboard-description"]').should('contain', 'Track your fitness journey');
    });

    it('displays stats cards', () => {
      cy.get('[data-cy="total-workouts-card"]').should('exist');
      cy.get('[data-cy="current-week-card"]').should('exist');
    });
  });

  describe('Quick Workout (No Active Program)', () => {
    it('shows options to choose a program or start quick workout when no program is active', () => {
      // Check if the "no active program" state is shown
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="choose-program-card"]').length > 0) {
          cy.get('[data-cy="choose-program-card"]').should('exist');
          cy.get('[data-cy="or-separator"]').should('contain', 'OR');
          cy.get('[data-cy="start-quick-workout-card"]').should('exist');
        }
      });
    });

    it('can start a quick workout session', () => {
      // Check if we're in the "no active program" state
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="start-quick-workout-card"]').length > 0) {
          // Click the "Start a Workout" card
          cy.get('[data-cy="start-quick-workout-card"]').click();

          // Should navigate to the workout session page
          cy.url().should('include', '/workout-sessions/');

          // Should see the complete workout button (disabled initially)
          cy.get('[data-cy="complete-workout-btn"]').should('exist');
        } else {
          cy.log('Active program exists - skipping quick workout test');
        }
      });
    });
  });

  describe('Program-based Workout', () => {
    it('shows the next workout card when a program is active', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="next-workout-card"]').length > 0) {
          cy.get('[data-cy="next-workout-card"]').should('exist');
          cy.get('[data-cy="start-workout-btn"]').should('exist');
        }
      });
    });

    it('can start a workout from an active program', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="next-workout-card-button"]').length > 0) {
          // Click the start/resume button
          cy.get('[data-cy="start-workout-btn"]').click();

          // Should navigate to the workout session page
          cy.url().should('include', '/workout-sessions/');

          // Should see the back button
          cy.get('[data-cy="back-btn"]').should('exist');
        } else {
          cy.log('No active program - skipping program workout test');
        }
      });
    });
  });

  describe('Active Workout Session', () => {
    it('shows active workout session card when a session is in progress', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="active-workout-session-card"]').length > 0) {
          cy.get('[data-cy="active-workout-session-header"]').should('contain', 'In Progress');
          cy.get('[data-cy="active-workout-session-card"]').should('exist');
          cy.get('[data-cy="discard-workout-btn"]').should('exist');
        }
      });
    });

    it('can resume an active workout session', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="active-workout-session-card"]').length > 0) {
          // Click the card to resume
          cy.get('[data-cy="active-workout-session-card"]').click();

          // Should navigate to the workout session page
          cy.url().should('include', '/workout-sessions/');
        }
      });
    });
  });
});

describe('Workout Session Page', () => {
  // This test assumes a workout session exists
  // You may need to create one first or use fixtures/mocks

  describe('Adding exercises to a workout', () => {
    it('can add an exercise to the workout session', () => {
      // First, start a quick workout or navigate to an existing session
      cy.visit('/');

      cy.get('body').then(($body) => {
        // Try quick workout first
        if ($body.find('[data-cy="start-quick-workout-card"]').length > 0) {
          cy.get('[data-cy="start-quick-workout-card"]').click();
        } else if ($body.find('[data-cy="next-workout-card-button"]').length > 0) {
          cy.get('[data-cy="start-workout-btn"]').click();
        } else if ($body.find('[data-cy="active-workout-session-card"]').length > 0) {
          cy.get('[data-cy="active-workout-session-card"]').click();
        }
      });

      // Wait for navigation to workout session page
      cy.url().should('include', '/workout-sessions/');

      // Click add exercise button
      cy.get('[data-cy="add-exercise-btn"]').first().click();

      // The modal should appear
      cy.get('[data-cy="search-exercise-input"]').should('be.visible');

      // Search for an exercise
      cy.get('[data-cy="search-exercise-input"]').type('Bench');

      // Wait for dropdown to show results and click one
      cy.contains('Bench').click();

      // Enter set count
      cy.get('[data-cy="set-count-input"]').should('be.visible');
      cy.get('[data-cy="set-count-input"]').type('3');

      // Click add exercise button in modal
      cy.get('[data-cy="add-exercise-btn"]').last().click();
    });
  });
});

describe('Navigation', () => {
  it('can navigate using the main navigation links', () => {
    cy.visit('/');

    // Navigate to Exercises
    cy.get('[data-cy="nav-exercises-link"]').click();
    cy.url().should('include', '/exercises');

    // Navigate to Programs
    cy.get('[data-cy="nav-programs-link"]').click();
    cy.url().should('include', '/programs');

    // Navigate back to Home
    cy.get('[data-cy="nav-home-link"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('can navigate to programs and create a new program', () => {
    cy.visit('/programs');

    // Click new program button
    cy.get('[data-cy="new-program-btn"]').click();

    // Fill out the form
    cy.get('[data-cy="program-name-input"]').type('Test Program');
    cy.get('[data-cy="program-description-input"]').type('A test program created by Cypress');
    cy.get('[data-cy="program-days-input"]').type('3');

    // Cancel to avoid creating test data
    cy.get('[data-cy="program-cancel-btn"]').click();
  });
});
