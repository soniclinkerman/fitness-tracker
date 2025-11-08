module Resolvers
  module Programs
    class FetchPrograms < GraphQL::Schema::Resolver
      argument :id, ID, required: false


      type [Types::ProgramType], null: false

      def resolve(**args)
        if args[:id]
          [Program.find_by(id: args[:id])].compact
        else
          Program.all
        end
      end

    end
  end
end