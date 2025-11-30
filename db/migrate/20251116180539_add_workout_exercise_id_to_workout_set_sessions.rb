class AddWorkoutExerciseIdToWorkoutSetSessions < ActiveRecord::Migration[8.0]
  def change
    add_column :workout_set_sessions, :workout_exercise_id, :integer, null:true
    add_column :workout_set_sessions, :exercise_name, :string
  end
end
