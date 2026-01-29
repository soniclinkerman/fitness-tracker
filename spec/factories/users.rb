FactoryBot.define do
  factory :user do
    email {"user#{SecureRandom.hex(4)}@example.com}"}
    # password {"password123"}
  end
end