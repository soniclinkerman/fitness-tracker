module Resolvers
  module WorkoutExercises
    class FetchWorkoutExercises < GraphQL::Schema::Resolver
      argument :id, ID, required: true

      type Types::WorkoutExerciseType, null: false
      def resolve(id:)
        WorkoutExercise.find(id)
      end
    end
  end
end