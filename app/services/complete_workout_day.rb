class CompleteSession
  def self.call(session)
    raise NotImplementedError, "No active session to complete"  if session.completed_at.present?
    session.update!(completed_at: Time.current)
    {
      workout_session: session,
      session_completed: true
    }
  end
end