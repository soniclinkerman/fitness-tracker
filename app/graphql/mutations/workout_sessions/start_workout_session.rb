module Mutations
  module WorkoutSessions
    class StartWorkoutSession < BaseMutation
      argument :user_id, ID, required: true
      argument :program_id, ID, required: false
      argument :workout_day_id, ID, required: false

      field :workout_session, Types::WorkoutSessionType, null: false

    def resolve(**args)
      user_id = context[:current_user]&.id || args[:user_id]
      workout_day_id = args[:workout_day_id]
      program_id = args[:program_id]
      workout_day = WorkoutDay.find_by(id: workout_day_id)
      raise GraphQL::ExecutionError, "Workout day not found" unless workout_day
      workout_exercises =workout_day.workout_exercises.includes(:workout_sets)

      # raise GraphQL::ExecutionError, "Failed to start workout: #{e.record.errors.full_messages.join(', ')}"
      ActiveRecord::Base.transaction do
        workout_session = WorkoutSession.create!(user_id: , program_id:)
        workout_day_session = WorkoutDaySession.create!(workout_session: workout_session, workout_day_id: )
        workout_exercises.each do |workout_exercise|
          workout_exercise.workout_sets.each do |workout_set|
            workout_set_session = WorkoutSetSession.create!(
              user_id: ,
              exercise_id: workout_exercise.exercise.id,
              exercise_name: workout_exercise.exercise.name,
              workout_exercise_id: workout_exercise.id,
              workout_day_session_id: workout_day_session.id,
              planned_weight: workout_set.planned_weight,
              target_reps_min: workout_set.target_reps_min,
              target_reps_max: workout_set.target_reps_max,
              )
          end
        end
        workout_session.started_at = Time.current
        workout_session.save!

        {workout_session: workout_session}
      end
    rescue ActiveRecord::RecordInvalid => e
      # Rollback happens automatically; raise a GraphQL-friendly error
      raise GraphQL::ExecutionError, "Failed to start workout: #{e.record.errors.full_messages.join(', ')}"
    rescue StandardError => e
      raise GraphQL::ExecutionError, "Unexpected error: #{e.message}"
    end
    end
    end
end