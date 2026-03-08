module Resolvers
  module WorkoutSessions
    class WorkoutsThisWeek < GraphQL::Schema::Resolver
      type Integer, null:true

      def resolve(**args)
        user = context[:current_user]
        return nil if user.nil?
        today = Date.current
        start_of_current_week = today.beginning_of_week
        end_of_current_week = today.end_of_week
        WorkoutSession.where(user_id: user.id).where(:completed_at => start_of_current_week..end_of_current_week).count
      end
    end
  end
end