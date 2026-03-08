class JwtService
    def self.encode(user_id)
      expiration = Time.now.to_i+ 24.hours
      JWT.encode({ user_id: user_id, exp: expiration }, Rails.application.credentials.secret_key_base, "HS256")
    end

    def self.decode(token)
      JWT.decode(token, Rails.application.credentials.secret_key_base, true, algorithm: "HS256")
    end
end