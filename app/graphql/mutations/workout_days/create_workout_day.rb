module Mutations
  module WorkoutDays
    class CreateWorkoutDay < BaseMutation
      argument :name, String, required: true
      argument :program_id, ID, required: true
      argument :day_number, Integer, required: true
      argument :description, String, required: false
      argument :notes, String, required: false

      field :workout_day, Types::WorkoutDayType, null: false

      def resolve(args)
        day_number = args[:day_number]
        program_id = args[:program_id]
        program = Program.find(program_id)

        if program.nil?
          raise GraphQL::ExecutionError, "Program does not exist."
        end

        if day_number < 1 || day_number > program.days_per_week
          raise GraphQL::ExecutionError, "Day number must be between 1 and #{program.days_per_week}."
        end
        if WorkoutDay.exists?(program_id: program_id, day_number: day_number)
          raise GraphQL::ExecutionError, "A day with this number already exists in the program."
        end

        workout_day = WorkoutDay.create(args)

        { workout_day: workout_day }
      end

    end
  end
end