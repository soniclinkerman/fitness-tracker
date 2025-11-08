class WorkoutExercise < ApplicationRecord
  belongs_to :exercise
  belongs_to :workout_day
  has_many :workout_sets, dependent: :destroy
  accepts_nested_attributes_for :workout_sets

  validates :workout_day, presence: true
end
