class AddCompletedAtColumnToWorkoutDaySession < ActiveRecord::Migration[8.0]
  def change
    add_column :workout_day_sessions, :completed_at, :datetime
  end
end
