# frozen_string_literal: true

module Mutations
  module Exercises
  class DeleteExercise < BaseMutation
    argument :id, ID, required: true
    field :exercise, Types::ExerciseType, null: true

    def resolve(id:)
      exercise = Exercise.find(id)
      exercise.destroy!
      { exercise: exercise }
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError, "Exercise not found"
    end

  end
  end
end
