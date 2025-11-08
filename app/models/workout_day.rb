class WorkoutDay < ApplicationRecord
  belongs_to :program
  has_many :workout_exercises, dependent: :destroy
end
