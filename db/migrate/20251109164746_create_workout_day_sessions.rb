class CreateWorkoutDaySessions < ActiveRecord::Migration[8.0]
  def change
    create_table :workout_day_sessions do |t|
      t.references :workout_session, null: false, foreign_key: true
      t.references :workout_day, null: true, foreign_key: true
      t.integer :position
      t.text :notes

      t.timestamps
    end
  end
end
