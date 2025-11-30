class AddPrecisionToWeights < ActiveRecord::Migration[8.0]
  def change
    change_column :workout_set_sessions,:completed_weight, :decimal, precision: 6, scale: 2

  end
end
