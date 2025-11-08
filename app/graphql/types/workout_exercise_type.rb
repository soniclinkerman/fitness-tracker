module Types
  class WorkoutExerciseType < Types::BaseObject
    field :id, ID, null: false
    field :workout_sets,  [Types::WorkoutSetType], null: true
    field :exercise, Types::ExerciseType, null: false
    field :workout_day, Types::WorkoutDayType, null: false
  end
end