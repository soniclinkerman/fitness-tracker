module Types
  class WorkoutSetSessionType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :exercise_id, ID, null: false
    field :workout_day_session_id, ID, null: true
    field :workout_session, WorkoutSessionType, null: true
    field :completed_weight, Float, null: true
    field :completed_reps, Integer, null: true
    field :notes, String, null: true
    field :rpe, Float, null: true
    field :is_failure, Boolean, null: true
    field :performed_at, GraphQL::Types::ISO8601DateTime, null: false
    field :exercise, ExerciseType, null: true
    field :planned_weight, Float, null: true
    field :target_reps_min, Int, null: true
    field :target_reps_max, Int, null: true
    field :order, Int, null:true
    field :created_at,  GraphQL::Types::ISO8601DateTime, null:true
    field :updated_at,  GraphQL::Types::ISO8601DateTime, null:true
  end
end