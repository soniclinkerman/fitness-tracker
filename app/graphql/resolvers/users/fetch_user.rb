module Resolvers
  module Users
    class FetchUser < GraphQL::Schema::Resolver
      type Types::UserType ,null: false

      def resolve(**args)
        context[:current_user]
      end
    end
  end
end