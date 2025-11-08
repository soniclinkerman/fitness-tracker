class SetUncategorizedForNullExercises < ActiveRecord::Migration[8.0]
  def up
    Exercise.where(category:nil).update_all(category: Exercise.categories[:uncategorized])
  end
  def down
    Exercise.where(category: Exercise.categories[:uncategorized] ).update_all(category: nil)
  end
end
