module Mutations
  module Exercises
    class CreateExercise < BaseMutation
      argument :name, String, required: true
      argument :description, String, required: false
      argument :default_sets, Integer, required: false
      argument :default_reps_min, Integer, required: false
      argument :default_reps_max, Integer, required: false
      argument :category, Types::Enums::ExerciseCategoryEnum, required: false

      field :exercise, Types::ExerciseType, null: true

      def resolve(**args)
        record = Exercise.create!(args)
        { exercise: record }
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError, e.record.errors.full_messages.join(", ")
      end

    end

  end
end