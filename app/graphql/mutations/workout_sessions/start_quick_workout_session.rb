module Mutations
  module WorkoutSessions
    class StartQuickWorkoutSession < BaseMutation
      field :workout_session, Types::WorkoutSessionType, null: false
      def resolve(**args)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "There is already an active workout session or user doesn't exist" if user.active_workout_session

        workout_session = WorkoutSession.create!(user_id: user.id, started_at: Time.current)
        WorkoutDaySession.create!(workout_session: workout_session, workout_day_id: nil)
        {workout_session: workout_session}
      rescue ActiveRecord::RecordInvalid => e
        # Rollback happens automatically; raise a GraphQL-friendly error
        raise GraphQL::ExecutionError, "Failed to start workout: #{e.record.errors.full_messages.join(', ')}"
      rescue StandardError => e
        raise GraphQL::ExecutionError, "Unexpected error: #{e.message}"
      end
    end
  end

end