class ChangeWorkoutSetWeightsToFloat < ActiveRecord::Migration[8.0]
  def change
    change_column :workout_sets, :planned_weight, :float
    change_column :workout_sets, :completed_weight, :float
  end
end
