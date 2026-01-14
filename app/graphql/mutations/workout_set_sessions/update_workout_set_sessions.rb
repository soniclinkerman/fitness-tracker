module Mutations
  module WorkoutSetSessions
    class UpdateWorkoutSetSessions < BaseMutation
      argument :sets, [Types::Inputs::WorkoutSetSessionInput], required: true
      argument :workout_exercise_id, ID, required: false
      field :workout_set_sessions, [Types::WorkoutSetSessionType]

      ALLOWED_ATTRIBUTES = [
        :completed_reps,
        :completed_weight,
        :notes,
        :is_failure,
        :rpe,
        :order
      ]
      def resolve(**args)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "User does not exist" if user.nil?
        active_workout_session = user.workout_sessions.where(completed_at: nil).order(created_at: :desc).first
        raise GraphQL::ExecutionError, "No active session exists" if active_workout_session.nil?

        workout_exercise = WorkoutExercise.find(args[:workout_exercise_id])

        existing_sets =  args[:sets].select { |x| x.id != nil}
        new_sets =  args[:sets].reject { |x| x.id != nil}

        # MUST be anchored to a session for this mutation design
        raise GraphQL::ExecutionError, "Workout exercise is not tied to a workout session" if workout_exercise.workout_session_id.nil?

        # Ownership
        raise GraphQL::ExecutionError, "Workout exercise does not belong to user" if workout_exercise.workout_session.user_id != user.id

        # Active-only rule (since you’re using active_workout_session below)
        raise GraphQL::ExecutionError, "Workout exercise is not in the active workout session" if workout_exercise.workout_session_id != active_workout_session.id

        workout_day_session = active_workout_session.workout_day_session
        exercise =workout_exercise.exercise



        ActiveRecord::Base.transaction do

          # UPDATE LOGIC
          ids = existing_sets.map(&:id)
          workout_set_sessions = WorkoutSetSession.where(id: ids)
          records_by_id = workout_set_sessions.index_by(&:id)

          validate_sets_belong_to_user!(workout_set_sessions, user)
          validate_sets_belong_to_active_session!(workout_set_sessions, active_workout_session)

          existing_sets.each do |set|
            record = records_by_id[set.id.to_i]
            next if record.nil?
            attrs = set.to_h.transform_keys { |key|
              key.to_s.underscore.to_sym
            }
            allowed_attrs = attrs.slice(*ALLOWED_ATTRIBUTES)
            record.update!(allowed_attrs)
          end


          # CREATE new (append order after current max)
          if new_sets.any?
            last_order = WorkoutSetSession.where(workout_exercise_id: workout_exercise.id).maximum(:order) || 0
            new_sets.each.with_index do |set,idx|
              attrs = set.to_h.transform_keys { |k| k.to_s.underscore.to_sym }
              # raise GraphQL::ExecutionError, "No active session exists"
              WorkoutSetSession.create!(
                user_id: user.id,
                exercise_id: exercise.id,
                workout_day_session: workout_day_session,
                exercise_name: exercise.name,
                workout_exercise: workout_exercise,
                completed_reps: attrs[:completed_reps],
                completed_weight: attrs[:completed_weight],
                order: last_order+1 || 1,
                performed_at: Time.current,
                )
            end
          end

          full_set_list = WorkoutSetSession.where(workout_exercise_id: workout_exercise.id).order(:order)
          { workout_set_sessions: full_set_list }
        end
      end

      def validate_sets_belong_to_user!(workout_set_sessions, current_user)
        workout_set_sessions.each do |set|
          if set.user_id != current_user.id
             raise GraphQL::ExecutionError, "Set does not belong to current user"
          end
        end
        true
      end

      def validate_sets_belong_to_active_session!(workout_set_sessions, active_workout_session)
        workout_set_sessions.each do |workout_set_session|
          session_id = workout_set_session.workout_day_session&.workout_session_id
          if session_id != active_workout_session.id
            raise GraphQL::ExecutionError, "Set does not belong to active workout session"
          end
        end
        true
      end

    end
  end
end