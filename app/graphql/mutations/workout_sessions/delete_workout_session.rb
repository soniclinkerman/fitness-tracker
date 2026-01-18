module Mutations
  module WorkoutSessions
    class DeleteWorkoutSession < BaseMutation
      field :message, String, null: false

      def resolve
        user = context[:current_user]
        raise GraphQL::ExecutionError, "User does not exist" if user.nil?

        workout_session = user.active_workout_session
        raise GraphQL::ExecutionError, "No active session" if workout_session.nil?
        raise GraphQL::ExecutionError, "Workout already completed" if workout_session.completed_at?

        workout_session.destroy!

        { message: "Session deleted" }
      end
    end
  end
end