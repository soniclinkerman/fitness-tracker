module Resolvers
  module WorkoutSessions
    class FetchWorkoutSession < GraphQL::Schema::Resolver
      # We don't pass in the user_id due to potentia securoty risks
      # Passing it in could allow anyone to see others info
      argument :workout_session_id, ID, required: true

      type Types::WorkoutSessionType, null: false
      def resolve(workout_session_id:)
        user_id = context[:current_user]
        #Grab the user
        # Retrieve the workout_session based on the id
        # return all the exercises and set info
        workout_session = WorkoutSession.find_by(id: workout_session_id, user_id: )
        return if workout_session.nil?
        workout_session
      end
    end
  end
end