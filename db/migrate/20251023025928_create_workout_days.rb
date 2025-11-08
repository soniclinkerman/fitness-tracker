class CreateWorkoutDays < ActiveRecord::Migration[8.0]
  def change
    create_table :workout_days do |t|
      t.string :name, null: false
      t.references :program, foreign_key: true, null: false
      t.string :description
      t.string :notes
      t.timestamps
    end
  end
end
