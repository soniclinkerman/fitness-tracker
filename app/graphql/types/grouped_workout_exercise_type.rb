# frozen_string_literal: true
module Types
  class GroupedWorkoutExerciseType < GraphQL::Schema::Object
    field :workout_exercise_id, ID, null: false
    field :exercise_name, String, null: false
    field :sets, [WorkoutSetSessionType], null: false
  end

end
