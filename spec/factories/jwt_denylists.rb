FactoryBot.define do
  factory :jwt_denylist do
    jti { "MyString" }
    exp { "2026-03-01 00:34:39" }
  end
end
