class CreateWorkoutExercises < ActiveRecord::Migration[8.0]
  def change
    create_table :workout_exercises do |t|
      t.references :exercise, null: false, foreign_key: true
      t.references :workout_day, null: false, foreign_key: true
      t.integer :current_weight
      t.integer :sets
      t.integer :reps_min
      t.integer :reps_max
      t.json :completed_weeks


      t.timestamps
    end
  end
end
