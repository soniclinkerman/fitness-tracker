class UpdateWorkoutExercise < ActiveRecord::Migration[8.0]
  def up
    remove_column :workout_exercises, :sets
    remove_column :workout_exercises, :reps_min
    remove_column :workout_exercises, :reps_max
    remove_column :workout_exercises, :current_weight
    add_reference :workout_exercises, :workout_day, null: false, foreign_key: true

  end

  def down
    add_column :workout_exercises, :sets, :integer
    add_column :workout_exercises, :reps_min, :integer
    add_column :workout_exercises, :reps_max, :integer
    add_column :workout_exercises, :current_weight, :integer
    add_reference :workout_exercises, :workout_day, null: false, foreign_key: true

  end
end
