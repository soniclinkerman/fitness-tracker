class WorkoutSetSession < ApplicationRecord
  belongs_to :user
  belongs_to :exercise
  belongs_to :workout_exercise
  belongs_to :workout_day_session, optional: true
  delegate :workout_session, to: :workout_day_session, allow_nil: true

  scope :ordered, -> {order(:order)}

  validate :order_check

  def order_check
    errors.add(:order, "must be greater than 0") if order.nil? || order <= 0
  end
end
