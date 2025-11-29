module Types
  class WorkoutSetType < Types::BaseObject
    field :id, ID, null: true
    field :set_number, Integer, null: true
    field :target_reps_min, Integer, null: true
    field :target_reps_max, Integer, null: true
    field :planned_reps, Integer, null: true
    field :planned_weight, Float, null: true
    field :completed_reps, Integer, null: true
    field :completed_weight, Float, null: true
    field :notes, String, null: true
    field :workout_exercise, Types::WorkoutExerciseType, null: true
  end
end