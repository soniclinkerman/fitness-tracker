module Mutations
  module WorkoutSets
  class SaveWorkoutSets < BaseMutation
    argument :workout_exercise_id, ID, required: true
    argument :exercise_id, ID, required: false
    argument :workout_sets, [Types::Inputs::WorkoutSetInputType], required: true

    field :exercise, Types::ExerciseType, null: true
    field :workout_sets, [Types::WorkoutSetType], null: false

    def resolve(workout_exercise_id:, workout_sets:, exercise_id:)
      workout_exercise = WorkoutExercise.find(workout_exercise_id)

      result_sets = []

      ActiveRecord::Base.transaction do
        if exercise_id
          workout_exercise.update(exercise_id: exercise_id)
        end
        # 1️⃣ Fetch all current set IDs
        existing_set_ids = workout_exercise.workout_sets.pluck(:id).map(&:to_s)

        # 2️⃣ Process incoming sets (create/update)
        incoming_ids = []
        workout_sets.each do |input|
          attrs = input.to_h.compact_blank
          set = nil

          if attrs[:id].present?
            # Update existing
            set = WorkoutSet.find(attrs[:id])
            set.update!(attrs)
            incoming_ids << attrs[:id].to_s
          else
            # Create new
            attrs[:workout_exercise_id] = workout_exercise_id
            set = WorkoutSet.create!(attrs)
            incoming_ids << set.id.to_s
          end

          result_sets << set
        end

        # 3️⃣ Delete any that were removed on frontend
        sets_to_delete = existing_set_ids - incoming_ids
        WorkoutSet.where(id: sets_to_delete).destroy_all if sets_to_delete.any?
      end

      { workout_sets: result_sets }
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError, e.message
    rescue ActiveRecord::RecordInvalid => e
      raise GraphQL::ExecutionError, e.record.errors.full_messages.join(", ")
    end
  end
  end
end
