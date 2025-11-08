module Mutations
  module WorkoutExercises
    class AddWorkoutExercise < BaseMutation
      argument :workout_day_id, ID, required: true
      argument :exercise_id, ID, required: true
      argument :workout_sets_attributes, [Types::Inputs::WorkoutSetInputType], required: true

      field :workout_exercise, Types::WorkoutExerciseType, null: true

      def resolve(workout_day_id:, exercise_id:, workout_sets_attributes:)
        workout_day = WorkoutDay.find(workout_day_id)
        sets_attributes = workout_sets_attributes.map(&:to_h)

        ActiveRecord::Base.transaction do
          workout_exercise = workout_day.workout_exercises.create!(
            exercise_id: exercise_id,
            workout_sets_attributes: sets_attributes
          )

          # Optional: do any additional logic (callbacks, etc.) here
          # If *anything* below raises, the transaction rolls back

          { workout_exercise: workout_exercise }
        end

      rescue ActiveRecord::RecordInvalid => e
        # Rollback happens automatically; raise a GraphQL-friendly error
        raise GraphQL::ExecutionError, "Failed to create workout exercise: #{e.record.errors.full_messages.join(', ')}"
      rescue StandardError => e
        raise GraphQL::ExecutionError, "Unexpected error: #{e.message}"
      end
    end
  end
end