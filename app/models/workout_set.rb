class WorkoutSet < ApplicationRecord
  belongs_to :workout_exercise
  validates :target_reps_min, numericality: { greater_than: 0 }, allow_nil: true

end