class CreateWorkoutSetSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :workout_set_sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :exercise, null: false, foreign_key: true
      t.references :workout_day_session, null: true
      t.decimal :completed_weight
      t.integer :completed_reps
      t.datetime :performed_at, default: -> { "CURRENT_TIMESTAMP" }
      t.text :notes
      t.boolean :is_failure
      t.decimal :rpe

      t.timestamps
    end
    add_foreign_key :workout_set_sessions, :workout_day_sessions, on_delete: :nullify
  end
end
