class User < ApplicationRecord
  has_many :workout_sessions, dependent: :destroy
  has_many :workout_set_sessions, dependent: :destroy
  # has_many :exercise_progresses, dependent: :destroy # for Phase 3 later
  has_many :programs, dependent: :destroy
  belongs_to :active_program, class_name: "Program", optional: true

  def active_workout_session
    workout_sessions.where(completed_at:nil).order(created_at: :desc).first
  end
end
