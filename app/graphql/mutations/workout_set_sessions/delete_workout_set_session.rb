module Mutations
  module WorkoutSetSessions
    class DeleteWorkoutSetSession < BaseMutation
      argument :id, ID, required:true
      field :workout_sets, [Types::WorkoutSetSessionType]

      def resolve(**args)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "User does not exist" if user.nil?

        active_workout_session = user.active_workout_session
        set_to_delete = WorkoutSetSession.find(args[:id])
        workout_session = set_to_delete.workout_session
        workout_exercise = set_to_delete.workout_exercise
        raise GraphQL::ExecutionError, "Session does not exist" if workout_session.nil?
        raise GraphQL::ExecutionError, "Set does not belong to active workout session" if workout_session != active_workout_session
        raise GraphQL::ExecutionError, "Set does not belong to user" if set_to_delete.user_id != user.id

        ActiveRecord::Base.transaction do
          deleted_order = set_to_delete.order
          set_to_delete.destroy!
          workout_sets = workout_exercise.workout_set_sessions.reload
          reorder_sets(workout_sets,deleted_order)
          {workout_sets: workout_sets.ordered}
        end

      end

      def reorder_sets(workout_sets, deleted_order)
        workout_sets.each do |set|
          set.update!(order: set.order - 1) if set.order > deleted_order
        end
      end
    end
  end
end

