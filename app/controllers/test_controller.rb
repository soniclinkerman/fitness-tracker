class TestController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false

  def reset
    DatabaseCleaner.clean_with(:truncation)
    head :ok
  end

  # Reset only workout sessions - less destructive for E2E tests
  def reset_workout_sessions
    WorkoutSession.destroy_all
    head :ok
  end
end