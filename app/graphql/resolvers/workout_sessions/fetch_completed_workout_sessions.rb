module Resolvers
  module WorkoutSessions
    class FetchCompletedWorkoutSessions < GraphQL::Schema::Resolver

      type [Types::WorkoutSessionType], null:true
      def resolve(**args)
        user = context[:current_user]
        return nil if user.nil?
        completed_sessions = WorkoutSession.where(user_id:user.id).where.not(completed_at:nil).order(started_at: :desc)
        completed_sessions
      end
    end
  end

end
