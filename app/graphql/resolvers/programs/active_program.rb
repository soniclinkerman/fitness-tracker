module Resolvers
  module Programs
    class ActiveProgram < GraphQL::Schema::Resolver
      type Types::ProgramType, null: true

      def resolve(**args)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "User does not exist" if user.nil?
        Program.find_by(id: user.active_program_id, user_id: user.id)
      end
    end
  end
end