class Program < ApplicationRecord
  validates :name, presence: true
  has_many :workout_days, -> {order(:day_number)}, dependent: :destroy
  belongs_to :user, optional: true

  def next_day
    workout_days.order(:day_number).find_by(completed: false)
  end

  def restartable?
    # When a user finishes all the workoutsessions in a given day and starts on day 1 again
    # We can restart the progrm

    all_sessions = user.workout_sessions.where(program_id: id)
    active_sessions = user.workout_sessions.where(archived_at: nil)

    # Case 1 — program has NEVER been started
    return true if all_sessions.empty?

    # Case 2 — already restarted but no new cycle started yet → NOT restartable
    return false if active_sessions.empty?

    # Case 3 — current cycle must be fully completed
    active_sessions.all? { |s| s.completed_at.present? }
  end


  def restart!
    raise ArgumentError, "Program can not be restarted" unless restartable?
    user.workout_sessions.where(archived_at: nil)
                    .update_all(archived_at: Time.current)
  end
end
