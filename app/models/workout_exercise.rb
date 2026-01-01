class WorkoutExercise < ApplicationRecord
  belongs_to :exercise
  belongs_to :workout_session, optional: true
  belongs_to :workout_day, optional: true
  has_many :workout_sets, dependent: :destroy
  has_many :workout_set_sessions
  accepts_nested_attributes_for :workout_sets

  validate :has_valid_anchor?

  def has_valid_anchor?
    if both_values_present? or no_values_present?
      return false
    end
    true
  end

  def both_values_present?
    workout_session.present? && workout_day.present?
  end

  def no_values_present?
    workout_session.nil? && workout_day.nil?
  end

end
