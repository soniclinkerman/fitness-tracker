FactoryBot.define do
  factory :workout_set_session do
    user
    exercise
    workout_exercise
    workout_day_session
    order { 1 }

    completed_reps { 10 }
    completed_weight { 100 }
  end
end