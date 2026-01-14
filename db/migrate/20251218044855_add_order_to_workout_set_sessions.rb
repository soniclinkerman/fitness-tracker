class AddOrderToWorkoutSetSessions < ActiveRecord::Migration[8.0]
  def change
    add_column :workout_set_sessions, :order, :integer
    add_index :workout_set_sessions, :order
  end
end
