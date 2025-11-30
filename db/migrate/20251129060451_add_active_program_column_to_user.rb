class AddActiveProgramColumnToUser < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :active_program_id, :integer
    add_index :users, :active_program_id
  end
end
