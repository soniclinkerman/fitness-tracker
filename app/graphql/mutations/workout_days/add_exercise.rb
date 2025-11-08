module Mutations
  module WorkoutDays

  class AddExercise < BaseMutation
    argument :workout_day_id, ID, required: true
    argument :exercise_id, ID, required: true
    argument :workout_sets_attributes, [Types::Inputs::WorkoutSetInputType], required: false


    field :workout_day, Types::WorkoutDayType

    def resolve(workout_day_id:, exercise_id:, workout_sets_attributes:)
      workout_day = WorkoutDay.find(workout_day_id)
      exercise = Exercise.find(exercise_id)
      ActiveRecord::Base.transaction do
        workout_exercise = WorkoutExercise.create!(
          exercise: exercise,
          workout_day: workout_day,
          workout_sets_attributes: workout_sets_attributes.map(&:to_h)
        )
      end
      {workout_day: workout_day}
    end
  end
  end
end
