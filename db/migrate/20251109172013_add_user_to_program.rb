class AddUserToProgram < ActiveRecord::Migration[8.0]
  def change
    add_reference :programs, :user, null: true, foreign_key: true
  end
end
