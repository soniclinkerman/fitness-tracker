describe('Log Workout Sets Flow', () => {

  // Helper to start a new workout session
  const getToWorkoutSession = () => {
    cy.visit('/');

    // Wait for dashboard to load
    cy.get('[data-cy="dashboard-title"]', { timeout: 10000 }).should('be.visible');

    // Wait for GraphQL data to load
    cy.wait(1000);

    // Check which state we're in and click appropriate button
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="start-workout-btn"]').length > 0) {
        // Has active program - click start workout button
        cy.get('[data-cy="start-workout-btn"]').click();
      } else if ($body.find('[data-cy="start-quick-workout-card"]').length > 0) {
        // No active program - start quick workout
        cy.get('[data-cy="start-quick-workout-card"]').click();
      } else {
        throw new Error('No way to start workout found on dashboard');
      }
    });

    // Verify we navigated to workout session
    cy.url().should('include', '/workout-sessions/');
  };

  // Helper to add an exercise to the current workout session
  const addExercise = (exerciseName, setCount) => {
    // Click add exercise button
    cy.get('[data-cy="add-exercise-btn"]').first().click();

    // Modal should appear with search input
    cy.get('[data-cy="search-exercise-input"]').should('be.visible');

    // Search for an exercise and select it
    cy.get('[data-cy="search-exercise-input"]').type(exerciseName);

    // Wait for dropdown and click first matching result
    cy.contains(exerciseName).first().click();

    // Set count input should appear
    cy.get('[data-cy="set-count-input"]').should('be.visible');
    cy.get('[data-cy="set-count-input"]').type(setCount.toString());

    // Submit the form
    cy.get('[data-cy="add-exercise-btn"]').last().click();

    // Wait for exercise to be added
    cy.wait(500);

    // Exercise should now appear in the list
    cy.contains(exerciseName).should('exist');
  };

  // Helper to click on an exercise card to go to logging page
  const goToExerciseLogging = (exerciseName) => {
    // Click on the exercise card (button containing exercise name)
    cy.contains('button', exerciseName).click();

    // Should be on the exercise logging page
    cy.get('[data-cy="exercise-logging-title"]').should('exist');
  };

  // Helper to log a single set
  // Uses select-all before typing since number inputs start with 0
  const logSet = (reps, weight) => {
    cy.get('[data-cy="logging-reps-input"]').focus().type('{selectall}').type(reps.toString());
    cy.get('[data-cy="logging-weight-input"]').focus().type('{selectall}').type(weight.toString());
    cy.get('[data-cy="logging-next-set-btn"]').click();
    cy.wait(300); // Wait for state update
  };

  // Helper to log all sets until review mode
  const logAllSets = (reps = 10, weight = 135, maxSets = 5) => {
    const logNextSet = (attempt = 0) => {
      if (attempt >= maxSets) return;

      cy.get('body').then(($body) => {
        if ($body.find('[data-cy="logging-next-set-btn"]').length > 0) {
          logSet(reps, weight + (attempt * 5));
          logNextSet(attempt + 1);
        }
      });
    };

    logNextSet();
  };

  describe('Add Exercise to Workout', () => {

    it('can add an exercise to a workout session', () => {
      getToWorkoutSession();
      addExercise('Bench', 3);
    });
  });

  describe('Log Sets for an Exercise', () => {

    it('can navigate to exercise logging page and log a set', () => {
      getToWorkoutSession();
      addExercise('Bench', 3);
      goToExerciseLogging('Bench');

      // Log first set
      logSet(10, 135);

      // Should show we're on set 2 now or completed set 1
      cy.contains('Set').should('exist');
    });

    it('can complete all sets and save the exercise', () => {
      getToWorkoutSession();
      addExercise('Squat', 3);
      goToExerciseLogging('Squat');

      // Log all sets
      logAllSets(8, 185);

      // After all sets, should see save button (review mode)
      cy.get('[data-cy="logging-save-exercise-btn"]', { timeout: 10000 }).should('be.visible');

      // Save the exercise
      cy.get('[data-cy="logging-save-exercise-btn"]').click();

      // Should navigate back to workout session page
      cy.url().should('include', '/workout-sessions/');

      // The exercise should show as "Done"
      cy.contains('Done').should('exist');
    });

    it('can add an extra set in review mode', () => {
      getToWorkoutSession();
      addExercise('Deadlift', 2);
      goToExerciseLogging('Deadlift');

      // Log all sets to get to review mode
      logAllSets(5, 225);

      // Should be in review mode
      cy.get('[data-cy="logging-save-exercise-btn"]', { timeout: 10000 }).should('be.visible');

      // Add an extra set
      cy.get('[data-cy="logging-add-set-btn"]').click();

      // Should have a new set input
      cy.contains('Set').should('exist');
    });
  });

  describe('Complete Full Workout', () => {

    it('can complete a full workout with one exercise', () => {
      getToWorkoutSession();

      // Add exercise
      addExercise('Bench Press', 3);

      // Go to exercise and log all sets
      goToExerciseLogging('Bench Press');
      logAllSets(10, 135);

      // Save exercise
      cy.get('[data-cy="logging-save-exercise-btn"]', { timeout: 10000 }).click();

      // Back on workout session page
      cy.url().should('include', '/workout-sessions/');

      // Exercise should be done
      cy.contains('Done').should('exist');

      // Complete workout button should now be enabled
      cy.get('[data-cy="complete-workout-btn"]').should('not.be.disabled');

      // Complete the workout
      cy.get('[data-cy="complete-workout-btn"]').click();

      // Should navigate to dashboard
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Data Persistence on Back Navigation', () => {

    it('persists set data when user presses back and returns to the exercise', () => {
      getToWorkoutSession();
      addExercise('Bench', 3);
      goToExerciseLogging('Bench');

      // Log first set with specific values
      logSet(12, 155);

      // Enter values for the second set but do NOT press complete
      cy.get('[data-cy="logging-reps-input"]').focus().type('{selectall}').type('8');
      cy.get('[data-cy="logging-weight-input"]').focus().type('{selectall}').type('175');

      // Press back button to go back to workout session
      cy.get('[data-cy="back-btn"]').click();

      // Should be back on workout session page
      cy.url().should('include', '/workout-sessions/');

      // Click back into the same exercise
      goToExerciseLogging('Bench');

      // The first set we completed should still show as done
      cy.contains('12 reps').should('exist');
      cy.contains('155 lbs').should('exist');

      // The second set values should be persisted too
      cy.get('[data-cy="logging-reps-input"]').should('have.value', '8');
      cy.get('[data-cy="logging-weight-input"]').should('have.value', '175');
    });
  });

  describe('Modify Saved Exercise', () => {

    it('can go back to a completed exercise, modify a set, and save', () => {
      getToWorkoutSession();
      addExercise('Squat', 3);
      goToExerciseLogging('Squat');

      // Log all sets to complete the exercise
      logAllSets(10, 185);

      // Save the exercise
      cy.get('[data-cy="logging-save-exercise-btn"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="logging-save-exercise-btn"]').click();

      // Should be back on workout session page with exercise marked as Done
      cy.url().should('include', '/workout-sessions/');
      cy.contains('Done').should('exist');

      // Go back to the exercise to modify it
      goToExerciseLogging('Squat');

      // Should be in review mode since all sets are already completed
      cy.get('[data-cy="logging-save-exercise-btn"]', { timeout: 10000 }).should('be.visible');

      // Modify the first set's reps - find the first reps input in review mode
      cy.get('input[type="number"]').first().focus().type('{selectall}').type('15');

      // Save the modified exercise
      cy.get('[data-cy="logging-save-exercise-btn"]').click();

      // Should be back on workout session page
      cy.url().should('include', '/workout-sessions/');

      // Exercise should still show as done
      cy.contains('Done').should('exist');
    });
  });

  describe('Unsaved Changes Modal', () => {

    it('shows unsaved changes modal when pressing back after modifying a saved exercise', () => {
      getToWorkoutSession();
      addExercise('Deadlift', 3);
      goToExerciseLogging('Deadlift');

      // Log all sets to complete the exercise
      logAllSets(5, 225);

      // Save the exercise
      cy.get('[data-cy="logging-save-exercise-btn"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-cy="logging-save-exercise-btn"]').click();

      // Back on workout session page
      cy.url().should('include', '/workout-sessions/');
      cy.contains('Done').should('exist');

      // Go back to the exercise to modify it
      goToExerciseLogging('Deadlift');

      // Should be in review mode
      cy.get('[data-cy="logging-save-exercise-btn"]', { timeout: 10000 }).should('be.visible');

      // Modify a set value to create unsaved changes
      cy.get('input[type="number"]').first().focus().type('{selectall}').type('99');

      // Should show "Unsaved Changes" indicator
      cy.contains('Unsaved Changes').should('exist');

      // Press back button
      cy.get('[data-cy="back-btn"]').click();

      // Unsaved changes modal should appear
      cy.contains('Unsaved Changes').should('be.visible');
      cy.get('[data-cy="logging-revert-btn"]').should('be.visible');
      cy.get('[data-cy="logging-save-changes-btn"]').should('be.visible');
    });

    it('can revert changes from the unsaved changes modal', () => {
      getToWorkoutSession();
      addExercise('Curl', 2);
      goToExerciseLogging('Curl');

      // Log all sets and save
      logAllSets(10, 30);
      cy.get('[data-cy="logging-save-exercise-btn"]', { timeout: 10000 }).click();
      cy.url().should('include', '/workout-sessions/');

      // Go back and modify
      goToExerciseLogging('Curl');
      cy.get('[data-cy="logging-save-exercise-btn"]', { timeout: 10000 }).should('be.visible');
      cy.get('input[type="number"]').first().focus().type('{selectall}').type('99');

      // Press back
      cy.get('[data-cy="back-btn"]').click();

      // Click revert changes
      cy.get('[data-cy="logging-revert-btn"]').click();

      // Should navigate back to workout session page
      cy.url().should('include', '/workout-sessions/');
    });

    it('can save changes from the unsaved changes modal', () => {
      getToWorkoutSession();
      addExercise('Row', 2);
      goToExerciseLogging('Row');

      // Log all sets and save
      logAllSets(10, 95);
      cy.get('[data-cy="logging-save-exercise-btn"]', { timeout: 10000 }).click();
      cy.url().should('include', '/workout-sessions/');

      // Go back and modify
      goToExerciseLogging('Row');
      cy.get('[data-cy="logging-save-exercise-btn"]', { timeout: 10000 }).should('be.visible');
      cy.get('input[type="number"]').first().focus().type('{selectall}').type('99');

      // Press back
      cy.get('[data-cy="back-btn"]').click();

      // Click save changes
      cy.get('[data-cy="logging-save-changes-btn"]').click();

      // Should navigate back to workout session page
      cy.url().should('include', '/workout-sessions/');

      // Exercise should still be done
      cy.contains('Done').should('exist');
    });
  });

  describe('Delete Exercise from Workout', () => {

    it('can delete an exercise from the workout session', () => {
      getToWorkoutSession();

      // First add an exercise
      addExercise('Curl', 3);

      // Now delete it
      cy.get('[data-cy="session-exercise-delete-btn"]').first().click();

      // Confirm deletion in modal
      cy.get('[data-cy="session-delete-exercise-confirm-btn"]').click();

      // Exercise should be removed
      cy.contains('Curl').should('not.exist');
    });
  });
});
