module Resolvers
  module WorkoutSessions
    class FetchActiveWorkoutSession < GraphQL::Schema::Resolver
      type Types::WorkoutSessionType, null: true

      def resolve
        user = context[:current_user]
        raise GraphQL::ExecutionError, "User does not exist" if user.nil?
        user.workout_sessions
            .where(completed_at: nil)
            .order(created_at: :desc)
            .first
      end
    end
  end
end

