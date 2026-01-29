# ============================================
# Exercise Library
# ============================================
# Run with: rails db:seed
# Safe to re-run — uses find_or_create_by on name

exercises = [
  # Chest
  { name: "Barbell Bench Press", category: :chest },
  { name: "Dumbell Bench Press", category: :chest, default_sets: 4, default_reps_min: 10, default_reps_max: 12, description: "An exercise that prioritizes the chest" },
  { name: "Incline Dumbell Bench Press", category: :chest, default_sets: 4, default_reps_min: 8, default_reps_max: 10 },
  { name: "Incline Bench Press", category: :chest },
  { name: "Dumbbell Fly", category: :chest, default_sets: 3, default_reps_min: 10, default_reps_max: 12 },
  { name: "Cable Crossover", category: :chest, default_sets: 3, default_reps_min: 10, default_reps_max: 15 },
  { name: "Chest Dip", category: :chest, default_sets: 3, default_reps_min: 8, default_reps_max: 12 },

  # Back
  { name: "Pull Ups", category: :back, default_sets: 3, default_reps_min: 10, default_reps_max: 12 },
  { name: "T-Bar", category: :back, default_sets: 3, default_reps_min: 8 },
  { name: "Cable Row", category: :back },
  { name: "Pull Down", category: :back },
  { name: "Barbell Row", category: :back, default_sets: 4, default_reps_min: 8, default_reps_max: 12 },
  { name: "Seated Cable Row", category: :back, default_sets: 3, default_reps_min: 10, default_reps_max: 12 },
  { name: "Face Pull", category: :back, default_sets: 3, default_reps_min: 12, default_reps_max: 15 },

  # Shoulders
  { name: "Shoulder Press", category: :shoulders, default_sets: 3, default_reps_min: 8, default_reps_max: 12 },
  { name: "Military Press", category: :shoulders, default_sets: 4 },
  { name: "Machine Lateral Raises", category: :shoulders },
  { name: "Lateral Raises (Machine)", category: :shoulders },
  { name: "Lateral Raises (Free Weights)", category: :shoulders },
  { name: "Rear Delt Fly (Dumbbell)", category: :shoulders },
  { name: "Shoulder Raises", category: :shoulders },

  # Biceps
  { name: "Bicep Curl", category: :biceps, default_sets: 3, default_reps_min: 10 },
  { name: "Bicep Curls (Free Weight)", category: :biceps },
  { name: "Hammer Curl", category: :biceps, default_sets: 3, default_reps_min: 10, default_reps_max: 12 },
  { name: "Preacher Curl", category: :biceps, default_sets: 3, default_reps_min: 8, default_reps_max: 12 },
  { name: "Concentration Curl", category: :biceps, default_sets: 3, default_reps_min: 10, default_reps_max: 12 },

  # Triceps
  { name: "Tricep Pushdown", category: :triceps, default_sets: 3, default_reps_min: 10, default_reps_max: 15 },
  { name: "Overhead Tricep Extension", category: :triceps, default_sets: 3, default_reps_min: 10, default_reps_max: 12 },
  { name: "Skull Crushers", category: :triceps, default_sets: 3, default_reps_min: 8, default_reps_max: 12 },
  { name: "Dips", category: :triceps, default_sets: 3, default_reps_min: 8, default_reps_max: 12 },
  { name: "Close Grip Bench Press", category: :triceps, default_sets: 3, default_reps_min: 8, default_reps_max: 10 },

  # Legs
  { name: "Squats", category: :legs, default_sets: 4 },
  { name: "Leg Press", category: :legs, default_sets: 3 },
  { name: "Hamstring Curl", category: :legs, default_sets: 3 },
  { name: "Bulgarian Split Squat", category: :legs },
  { name: "RDL", category: :legs, description: "Make sure to hinge. Pause at the bottom 5 seconds" },
  { name: "Leg Extension", category: :legs, default_sets: 3, default_reps_min: 10, default_reps_max: 15 },
  { name: "Calf Raises", category: :legs, default_sets: 4, default_reps_min: 12, default_reps_max: 20 },
  { name: "Lunges", category: :legs, default_sets: 3, default_reps_min: 10, default_reps_max: 12 },
  { name: "Seated Leg Curl", category: :legs, default_sets: 3, default_reps_min: 10, default_reps_max: 12 },

  # Glutes
  { name: "Hip Thrust", category: :glutes, default_sets: 4, default_reps_min: 8, default_reps_max: 12 },
  { name: "Glute Bridge", category: :glutes, default_sets: 3, default_reps_min: 10, default_reps_max: 15 },
  { name: "Cable Kickback", category: :glutes, default_sets: 3, default_reps_min: 12, default_reps_max: 15 },

  # Abs
  { name: "Plank", category: :abs, description: "Hold for time rather than reps" },
  { name: "Hanging Leg Raise", category: :abs, default_sets: 3, default_reps_min: 10, default_reps_max: 15 },
  { name: "Cable Crunch", category: :abs, default_sets: 3, default_reps_min: 12, default_reps_max: 20 },
  { name: "Ab Rollout", category: :abs, default_sets: 3, default_reps_min: 8, default_reps_max: 12 },

  # Full Body
  { name: "Deadlift", category: :full_body },

  # Cardio
  { name: "Treadmill", category: :cardio, description: "Log duration in reps field (minutes)" },
  { name: "Stairmaster", category: :cardio, description: "Log duration in reps field (minutes)" },
  { name: "Rowing Machine", category: :cardio, description: "Log duration in reps field (minutes)" },
  { name: "Cycling", category: :cardio, description: "Log duration in reps field (minutes)" },
]

exercises.each do |attrs|
  Exercise.find_or_create_by!(name: attrs[:name]) do |exercise|
    exercise.category = attrs[:category]
    exercise.default_sets = attrs[:default_sets]
    exercise.default_reps_min = attrs[:default_reps_min]
    exercise.default_reps_max = attrs[:default_reps_max]
    exercise.description = attrs[:description]
  end
end

puts "✅ Seeded #{Exercise.count} exercises"
