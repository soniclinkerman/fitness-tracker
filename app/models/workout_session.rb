class WorkoutSession < ApplicationRecord
  belongs_to :user
  belongs_to :program, optional: true
  has_one :workout_day_session, dependent: :destroy
  has_many :workout_exercises, dependent: :destroy
end
