class AddWorkoutSessionToWorkoutExercises < ActiveRecord::Migration[8.0]
  def change
    add_reference :workout_exercises, :workout_session, null: true, foreign_key: true
  end
end
