class AddUniqueIndexToExercisesName < ActiveRecord::Migration[7.1]
  def change
    add_index :exercises, "LOWER(name)", unique: true, name: "index_exercises_on_lower_name"
  end
end

