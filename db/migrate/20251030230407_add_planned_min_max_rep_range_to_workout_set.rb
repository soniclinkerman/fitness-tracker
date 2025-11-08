class AddPlannedMinMaxRepRangeToWorkoutSet < ActiveRecord::Migration[8.0]
  def change
    add_column :workout_sets, :target_reps_min, :integer
    add_column :workout_sets, :target_reps_max, :integer
  end
end
