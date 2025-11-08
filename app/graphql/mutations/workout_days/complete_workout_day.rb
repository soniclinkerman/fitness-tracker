module Mutations
  module WorkoutDays
    class CompleteWorkoutDay < BaseMutation
      argument :id, ID, required: true
      argument :completed, Boolean, required: true, default_value: false

      field :workout_day, Types::WorkoutDayType, null: false

      def resolve(id:, completed:)
        workout_day = WorkoutDay.find(id)
        workout_day.update!(completed: completed)
        { workout_day: workout_day }
      end
    end
  end
end