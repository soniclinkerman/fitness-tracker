module Resolvers
  module WorkoutSessions
    class CurrentWorkoutSession < GraphQL::Schema::Resolver
      type Types::WorkoutSessionType, null: true



      def resolve
        user = context[:current_user]
        return nil if user.nil?
        user.workout_sessions.where(:completed_at => nil).order(created_at: :desc).first
      end
    end
  end
end