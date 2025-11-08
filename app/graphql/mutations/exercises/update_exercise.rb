module Mutations
  module Exercises
    class UpdateExercise < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :description, String, required: false
      argument :default_sets, Integer, required: false
      argument :default_reps_min, Integer, required: false
      argument :default_reps_max, Integer, required: false
      argument :category, Types::Enums::ExerciseCategoryEnum, required: false

      field :exercise, Types::ExerciseType, null: true

      def resolve(id:, **args)
        exercise = Exercise.find_by(id: id)
        raise GraphQL::ExecutionError, "Exercise not found" unless exercise

        if exercise.update!(args)
          { exercise: exercise }
        end
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError, e.record.errors.full_messages.join(", ")
      end

    end
  end
end