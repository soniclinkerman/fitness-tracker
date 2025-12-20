module Types
  class ExerciseSessionHistoryType < Types::BaseObject
    field :workout_session, Types::WorkoutSessionType, null:false
    field :sets, [Types::WorkoutSetSessionType], null:false
  end
end