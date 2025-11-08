module Mutations
  module WorkoutDays
    class UpdateWorkoutDay < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false

      field :workout_day, Types::WorkoutDayType, null: false
      def resolve(**args)
        workout_day = WorkoutDay.find(args[:id])
        workout_day.update(args)
        {workout_day: workout_day}
      end
    end
  end
end