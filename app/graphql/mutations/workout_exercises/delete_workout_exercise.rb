module Mutations
  module WorkoutExercises
    class DeleteWorkoutExercise < BaseMutation
      argument :id, ID, required: true

      field :success, Boolean, null: false
      field :errors, [String], null: false
      field :workout_exercise, Types::WorkoutExerciseType, null: true

      def resolve(id:)
        workout_exercise = WorkoutExercise.find_by(id: id)

        return { success: false, errors: ["Workout exercise not found"], workout_exercise: nil } unless workout_exercise

        if workout_exercise.destroy
          { success: true, errors: [], workout_exercise: workout_exercise }
        else
          { success: false, errors: workout_exercise.errors.full_messages, workout_exercise: nil }
        end
      rescue StandardError => e
        raise GraphQL::ExecutionError, "Unexpected error deleting exercise: #{e.message}"
      end
    end
  end
end
