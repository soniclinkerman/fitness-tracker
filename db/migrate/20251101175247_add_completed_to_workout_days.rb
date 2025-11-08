class AddCompletedToWorkoutDays < ActiveRecord::Migration[8.0]
  def change
    add_column :workout_days, :completed, :boolean, default: false
  end
end
