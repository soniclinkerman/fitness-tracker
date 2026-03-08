class AddUserIdToExercises < ActiveRecord::Migration[8.0]
  def change
    add_reference :exercises, :user,  foreign_key: true
  end
end
