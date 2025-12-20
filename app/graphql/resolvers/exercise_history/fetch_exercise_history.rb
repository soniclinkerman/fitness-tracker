module Resolvers
  module ExerciseHistory
    class FetchExerciseHistory <  GraphQL::Schema::Resolver
      argument :exercise_id, ID, required: true
      type [Types::ExerciseSessionHistoryType], null:false

      def resolve(**args)
        sessions_by_workout = {}

        # Eager loading workout session since we access it in the loop
        set_sessions = WorkoutSetSession.includes(:workout_exercise, workout_day_session: :workout_session)
                         .joins(:workout_exercise).joins(workout_day_session: :workout_session)
                                        .where(workout_exercise: { exercise_id: args[:exercise_id] })
                                        .where.not(workout_sessions: {completed_at: nil})
                                        .ordered

        set_sessions.each do |set_session|
          workout_session = set_session.workout_session
            sessions_by_workout[workout_session] ||= []
            sessions_by_workout[workout_session] << set_session

        end

        exercise_sessions = []

        sessions_by_workout.each do |workout_session, set_sessions|
          exercise_sessions << {
            workout_session: workout_session,
            sets: set_sessions
          }
        end

        exercise_sessions
      end
    end
  end
end
