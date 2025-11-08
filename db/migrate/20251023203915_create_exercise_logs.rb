class CreateExerciseLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :exercise_logs do |t|
      t.references :workout_exercise, null: false, foreign_key: true
      t.integer :set_number
      t.integer :reps_done
      t.string :skip_reason
      t.integer :weight
      t.boolean :passed

      t.timestamps
    end
  end
end
