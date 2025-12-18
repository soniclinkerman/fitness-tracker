class CompleteSession
  def self.call(session)
    raise NotImplementedError, "No active session to complete"  if session.completed_at.present?
    ActiveRecord::Base.transaction do
      session.update!(completed_at: Time.current)

      ActiveRecord::Base.transaction do
        program = session.program
        day_session = session.workout_day_session
        workout_day = day_session&.workout_day

        if program && workout_day && program.is_last_day_of_program?(workout_day)
          session.user.update!(active_program: nil)
        end
      end
      {
        workout_session: session,
        session_completed: true
      }

    end
  end
end