module Mutations
  module Programs
    class UpdateActiveProgram < BaseMutation
      argument :id, ID, required: false
      field :program, Types::ProgramType

      def resolve(**args)
        id = args[:id]
        user = context[:current_user]
        raise GraphQL::ExecutionError, "User does not exist" if user.nil?
        if id.nil?
          user.update!(active_program: nil)
          return {program: nil}
        end

        program = Program.find_by(id:id, user_id: user.id)
        raise GraphQL::ExecutionError, "Program does not exist" if program.nil?
        user.update!(active_program: program)
        {program: program}
      end
    end
  end
end