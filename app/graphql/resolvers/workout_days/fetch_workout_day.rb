module Resolvers
  module WorkoutDays
    class FetchWorkoutDay < GraphQL::Schema::Resolver
      argument :id, ID, required: true

      type Types::WorkoutDayType, null: false
      def resolve(**args)
        WorkoutDay.find(args[:id])
      end
    end
  end
end