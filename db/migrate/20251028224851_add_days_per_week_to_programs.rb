class AddDaysPerWeekToPrograms < ActiveRecord::Migration[8.0]
  def change
    add_column :programs, :days_per_week, :integer
  end
end
