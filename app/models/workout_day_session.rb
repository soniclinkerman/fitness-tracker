class WorkoutDaySession < ApplicationRecord
  belongs_to :workout_session
  belongs_to :workout_day
  has_many :workout_set_sessions, dependent: :nullify
end
