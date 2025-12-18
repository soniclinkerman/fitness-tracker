class Program < ApplicationRecord
  validates :name, presence: true
  has_many :workout_days, dependent: :destroy
  belongs_to :user, optional: true

  public
  def next_workout_day
    program = user.active_program
    return nil if program.nil?

    days = program.workout_days.order(:day_number)

    last_session = user.workout_sessions
                       .where(program_id: program.id)
                       .where.not(completed_at: nil)
                       .order(completed_at: :desc)
                       .first

    return days.first if last_session.nil?

    completed_day = last_session.workout_day_session&.workout_day
    return days.first if completed_day.nil?

    i = days.index(completed_day)
    return days.first if i.nil?

    next_day = days[i + 1]
    return days.first if next_day.nil?

    next_day
  end


  # When a user finishes all the workoutsessions in a given day and starts on day 1 again
  # We can restart the progrm
  def restartable?

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

  def last_day
    workout_days.order(day_number: :desc).first
  end

  def is_last_day_of_program?(workout_day)
     workout_day == last_day
  end
end
