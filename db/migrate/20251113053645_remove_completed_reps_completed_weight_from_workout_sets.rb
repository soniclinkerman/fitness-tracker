class RemoveCompletedRepsCompletedWeightFromWorkoutSets < ActiveRecord::Migration[8.0]
  def change
    remove_column :workout_sets, :completed_reps
    remove_column :workout_sets, :completed_weight
  end
end
