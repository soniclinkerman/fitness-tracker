FactoryBot.define do

  factory :workout_session do
    user
    trait :with_program do
      program
    end
    completed_at {nil}
    started_at {nil}
  end
end