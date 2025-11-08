module Mutations
  module Programs
    class DeleteProgram < BaseMutation
      argument :id, ID, required: true

      field :program, Types::ProgramType, null: false

      def resolve(id:)
      program = Program.find(id)
      program.destroy!
      { program: program }
    rescue ActiveRecord::RecordNotFound
      raise GraphQL::ExecutionError, "Program not found"
    end
  end
end
end