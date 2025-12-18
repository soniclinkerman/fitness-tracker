module Mutations
  module WorkoutSetSessions
    class UpdateWorkoutSetSessions < BaseMutation
      argument :sets, [Types::Inputs::WorkoutSetSessionInput], required: true
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
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, "User does not exist" if current_user.nil?
        active_workout_session = current_user.workout_sessions.where(completed_at: nil).order(created_at: :desc).first
        raise GraphQL::ExecutionError, "No active session exists" if active_workout_session.nil?

        ids = args[:sets].map(&:id)
        workout_set_sessions = WorkoutSetSession.where(id: ids)
        records_by_id = workout_set_sessions.index_by(&:id)

        validate_sets_belong_to_user!(workout_set_sessions, current_user)
        validate_sets_belong_to_active_session!(workout_set_sessions, active_workout_session)

          args[:sets].each do |set|
            record = records_by_id[set.id.to_i]
            next if record.nil?
            attrs = set.to_h.transform_keys { |key|
              key.to_s.underscore.to_sym
            }
            allowed_attrs = attrs.slice(*ALLOWED_ATTRIBUTES)
            record.update!(allowed_attrs)
          end
          { workout_set_sessions: workout_set_sessions.reload }
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