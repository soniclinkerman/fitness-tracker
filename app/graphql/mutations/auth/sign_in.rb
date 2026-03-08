module Mutations
  module Auth
    class SignIn < BaseMutation
      argument :email, String, required:true
      argument :password, String, required:true

      
      field :token, String, null:false
      def resolve(**args)
        email = args[:email]
        password = args[:password]
        user = User.find_by!(email:)

        if user.valid_password?(password)
          token =JwtService.encode(user.id)
          { token: token }
        else
          raise GraphQL::ExecutionError, "Invalid password"
        end

      rescue ActiveRecord::RecordNotFound
        raise GraphQL::ExecutionError, "User not found"
        end
    end
  end
end