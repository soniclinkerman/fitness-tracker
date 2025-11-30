class AddArchivedAtColumnToWorkoutSessions < ActiveRecord::Migration[8.0]
  def change
    add_column :workout_sessions, :archived_at,  :datetime
  end
end
