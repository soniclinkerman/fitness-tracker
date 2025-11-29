module Mutations
  module WorkoutSessions
    class CompleteWorkoutSession < BaseMutation

      field :workout_session, Types::WorkoutSessionType
      field :session_completed, Boolean
      def resolve
        user = context[:current_user]
        return nil if user.nil?
        active_session = user.workout_sessions.where(:completed_at => nil).order(created_at: :desc).first
        CompleteSession.call(session: active_session)
      end
    end
  end
end