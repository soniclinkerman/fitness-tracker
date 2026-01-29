FactoryBot.define do
  factory :workout_exercise do
    exercise
  end

  factory :program_workout_exercise, class: "WorkoutExercise" do
    exercise
    workout_day
  end

  factory :session_workout_exercise, class: "WorkoutExercise" do
    exercise
    workout_session
  end
end