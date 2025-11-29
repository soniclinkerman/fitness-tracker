WorkoutSetSession.destroy_all
WorkoutDaySession.destroy_all
WorkoutSession.destroy_all
Program.where(description: 'Example 3-day split').destroy_all
User.destroy_all
# --- USERS ---
user = User.create!(name: "Test User", email: "test@example.com")

# --- STATIC STRUCTURE ---
program = Program.create!(name: "Push/Pull/Legs", description: "Example 3-day split", user: user, days_per_week: 3)

exercise = Exercise.first

workout_day = program.workout_days.create!(
  name: "Push Day",
  day_number: 1
)

workout_exercise = workout_day.workout_exercises.create!(
  exercise: exercise,
  workout_day: workout_day
)

# --- DYNAMIC STRUCTURE ---
workout_session = WorkoutSession.create!(
  user: user,
  program: program,
  started_at: Time.current,
  notes: "First push workout!"
)

workout_day_session = workout_session.workout_day_sessions.create!(
  workout_day: workout_day,
  position: 1,
  notes: "Felt good today"
)

# --- LOG SOME SETS ---
3.times do |i|
  WorkoutSetSession.create!(
    user: user,
    exercise: exercise,           # or Exercise.find_by(name: "Bench Press") if you store separately
    workout_day_session: workout_day_session,
    completed_weight: 185,
    completed_reps: [8, 9, 10][i],
    is_failure: false,
    rpe: 8 + (i * 0.5)
  )
end

puts "✅ Seeded: #{User.count} user, #{Program.count} program, #{WorkoutSession.count} session, #{WorkoutSetSession.count} sets"
