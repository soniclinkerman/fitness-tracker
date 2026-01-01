module Mutations
  module WorkoutSessions
    class AddExerciseToWorkoutSession < BaseMutation
      MAX_WORKOUT_SETS = 10
      argument :workout_session_id, ID, required: true
      argument :exercise_id, ID, required: true
      argument :set_count, Integer, required: false
      field :workout_session, Types::WorkoutSessionType, null:false

      def resolve(**args)
        # Basic Checks
        user = context[:current_user]
        workout_session_id = args[:workout_session_id]
        exercise_id = args[:exercise_id]
        set_count =args[:set_count] || 1

        exercise = Exercise.find(exercise_id)
        workout_session = WorkoutSession.find_by(id: workout_session_id, user: user)
        raise GraphQL::ExecutionError, "Workout Session does not belong to user" if workout_session.nil?
        raise GraphQL::ExecutionError, "Workout Session already complete" if workout_session.completed_at.present?
        raise GraphQL::ExecutionError, "Set count should be greater than 0" if set_count < 1
        raise GraphQL::ExecutionError, "Set count can not be greater than 10" if set_count > MAX_WORKOUT_SETS

        ActiveRecord::Base.transaction do
          workout_day_session = workout_session.workout_day_session
          workout_exercise = WorkoutExercise.create!(
            exercise_id:exercise.id,
            workout_session: workout_session
          )

          set_count.times do |i|
            workout_set_session =  WorkoutSetSession.create!(
              user_id: user.id,
              exercise_id: exercise.id,
              workout_day_session: workout_day_session,
              exercise_name: exercise.name,
              workout_exercise: workout_exercise,
              order: i+1
            )
          end



          {workout_session: workout_session}
        end
      end
    end
  end
end