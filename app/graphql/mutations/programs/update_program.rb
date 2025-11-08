module Mutations
  module Programs
    class UpdateProgram < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :description, String, required: false
      argument :days_per_week, Integer, required: false

      field :program, Types::ProgramType, null: false

      def resolve(**args)
        program = Program.find(args[:id])

        # Remove :id so we don’t try to update it
        update_attrs = args.except(:id).compact_blank

        # Safely apply only the provided fields
        program.update!(update_attrs)

        { program: program }
      rescue ActiveRecord::RecordNotFound
        raise GraphQL::ExecutionError, "Program not found"
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError, e.record.errors.full_messages.join(", ")
      end
    end
  end
end
