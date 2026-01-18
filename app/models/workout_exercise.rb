class WorkoutExercise < ApplicationRecord
  belongs_to :exercise
  belongs_to :workout_session, optional: true
  belongs_to :workout_day, optional: true
  has_many :workout_sets, dependent: :destroy
  has_many :workout_set_sessions, dependent: :destroy
  accepts_nested_attributes_for :workout_sets

  validate :has_valid_anchor?

  validate :has_valid_anchor?

  def has_valid_anchor?
    if workout_session.present? && workout_day.present?
      errors.add(:base, "WorkoutExercise cannot belong to both workout_day and workout_session")
    elsif workout_session.nil? && workout_day.nil?
      errors.add(:base, "WorkoutExercise must belong to either workout_day or workout_session")
    end
  end

end
