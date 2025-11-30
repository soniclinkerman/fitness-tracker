class CreateExerciseProgresses < ActiveRecord::Migration[8.0]
  def change
    create_table :exercise_progresses do |t|
      t.references :user, null: false, foreign_key: true
      t.references :exercise, null: false, foreign_key: true
      t.decimal :current_weight, precision: 6, scale:2
      t.decimal :next_weight, precision: 6, scale:2
      t.integer :last_completed_reps
      t.decimal :increment_value, precision: 6, scale:2

      t.timestamps

    end
    add_index :exercise_progresses, [:user_id, :exercise_id], unique: true
  end
end
