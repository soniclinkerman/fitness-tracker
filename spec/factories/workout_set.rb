FactoryBot.define do
  factory :workout_set do
    workout_exercise
    planned_weight { 100 }
    target_reps_min { 8 }
    target_reps_max { 12 }
  end
end