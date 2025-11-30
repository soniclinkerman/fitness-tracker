class CreateWorkoutSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :workout_sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :program, null: true, foreign_key: true
      t.datetime :started_at
      t.datetime :ended_at
      t.text :notes

      t.timestamps
    end
  end
end
