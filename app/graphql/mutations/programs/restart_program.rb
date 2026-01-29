module Mutations
  module Programs
    class RestartProgram < BaseMutation
      argument :id, ID, required:true

      field :program, Types::ProgramType

      def resolve(**args)
        id = args[:id]
        user = context[:current_user]
        raise GraphQL::ExecutionError, "User does not exist" if user.nil?

        program = user.programs.find_by(id: id)
        raise GraphQL::ExecutionError, "Program does not exist" if program.nil?

        program.restart!
        { program: program}
      end
    end
  end
end