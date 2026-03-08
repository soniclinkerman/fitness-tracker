module Mutations
  module Auth
    class SignUp < BaseMutation
      argument :name, String, required: true
      argument :email, String, required: true
      argument :password, String, required: true

      field :token, String, null: false

      def resolve(**args)
        name = args[:name]
        email = args[:email]
        password = args[:password]

        created_user = User.create!(name:,email:, password:)
        {token: JwtService.encode(created_user.id)}


      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError, e.record.errors.full_messages.join(", ")
      end
    end
  end
end