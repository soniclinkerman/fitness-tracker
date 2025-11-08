module Mutations
  module Programs
    class CreateProgram < BaseMutation
      argument :name, String, required: true
      argument :description, String, required: false
      argument :days_per_week, Integer, required: true

      field :program, Types::ProgramType, null: false

      def resolve(name:, description: nil, days_per_week:)
        # Validate days_per_week
        if days_per_week < 1 || days_per_week > 7
          raise GraphQL::ExecutionError, "Program can only have up to 7 days per week."
        end

        # Create Program
        program = Program.create(name: name, description: description, days_per_week: days_per_week)

        # Create WorkoutDays
        days_per_week.times do |i|
          WorkoutDay.create(program: program, name: "Day #{i + 1}", day_number: i + 1)
        end

        { program: program }
      end

    end
  end
end