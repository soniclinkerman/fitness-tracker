class CreateExercises < ActiveRecord::Migration[8.0]
  def change
    create_table :exercises do |t|
      t.string :name, null: false
      t.string :description
      t.integer :default_sets
      t.integer :default_reps_min
      t.integer :default_reps_max


      t.timestamps
    end
  end
end
