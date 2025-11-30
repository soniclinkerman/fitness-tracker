class NormalizeWorkoutSessionState < ActiveRecord::Migration[8.0]
  def change
    remove_column :workout_day_sessions, :completed_at
    add_column :workout_sessions, :completed_at, :datetime
  end
end