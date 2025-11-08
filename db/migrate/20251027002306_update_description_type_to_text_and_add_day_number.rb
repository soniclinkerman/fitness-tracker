class UpdateDescriptionTypeToTextAndAddDayNumber < ActiveRecord::Migration[8.0]
  def up
    change_column :workout_days, :description, :text
    change_column :workout_days, :notes, :text
    add_column :workout_days, :day_number, :integer
  end

  def down
    change_column :workout_days, :description, :string
    change_column :workout_days, :notes, :string
    remove_column :workout_days, :day_number
  end
end
