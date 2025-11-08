class CreatePrograms < ActiveRecord::Migration[8.0]
  def change
    create_table :programs do |t|
      t.string :name, null: false
      t.string :description
      t.date :start_date

      t.timestamps
    end
  end
end
