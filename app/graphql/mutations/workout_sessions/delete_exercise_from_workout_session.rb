module Mutations
  module WorkoutSessions
    class DeleteExerciseFromWorkoutSession < BaseMutation
      argument :id, ID, required: true
      field :workout_session, Types::WorkoutSessionType, null: false

      def resolve(**args)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "User does not exist" if user.nil?

        active_workout_session = user.active_workout_session
        workout_exercise_to_delete = WorkoutExercise.find_by(id: args[:id])
        raise GraphQL::ExecutionError, "Workout Exercise does not exist" if workout_exercise_to_delete.nil?
        raise GraphQL::ExecutionError, "No session is active" if active_workout_session.nil?
        raise GraphQL::ExecutionError, "Workout Session has already been completed" if active_workout_session.completed_at?
        raise GraphQL::ExecutionError, "Workout Exercise does not belong to active workout session" if workout_exercise_to_delete.workout_session != active_workout_session

        ActiveRecord::Base.transaction do
          workout_exercise_to_delete.workout_set_sessions.each do |set|
            set.destroy!
          end
          workout_exercise_to_delete.destroy!
          {workout_session: active_workout_session}
        end
      end
    end
  end
end