class AddPlannedWeightTargetRepsMinMaxToWorkoutSetSession < ActiveRecord::Migration[8.0]
  def change
    add_column :workout_set_sessions, :planned_weight, :decimal, precision: 6, scale: 2
    add_column :workout_set_sessions, :target_reps_min, :integer
    add_column :workout_set_sessions, :target_reps_max, :integer
  end
end
