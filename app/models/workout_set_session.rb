class WorkoutSetSession < ApplicationRecord
  belongs_to :user
  belongs_to :exercise
  belongs_to :workout_day_session, optional: true
  delegate :workout_session, to: :workout_day_session, allow_nil: true

end
