class WorkoutSet < ApplicationRecord
  belongs_to :workout_exercise
  validates :target_reps_min, numericality: { greater_than: 0 }, allow_nil: true

  def completed_within_target?
    return false unless completed_reps && target_reps_min && target_reps_max
    completed_reps >= target_reps_min
  end
end