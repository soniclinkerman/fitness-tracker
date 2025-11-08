class CreateWorkoutSets < ActiveRecord::Migration[8.0]
  def change
    create_table :workout_sets do |t|
      t.references :workout_exercise, null: false, foreign_key: true
      t.integer :set_number
      t.integer :planned_reps
      t.float :planned_weight
      t.integer :completed_reps
      t.float :completed_weight
      t.text :notes

      t.timestamps
    end
  end
end
