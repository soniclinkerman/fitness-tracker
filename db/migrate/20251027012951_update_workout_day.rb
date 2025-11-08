class UpdateWorkoutDay < ActiveRecord::Migration[8.0]
  def up
    add_reference :workout_days, :program, foreign_key: true
  end

  def down
    remove_reference :workout_days, :program, foreign_key: true
  end
end
