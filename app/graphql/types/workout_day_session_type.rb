module Types
  class WorkoutDaySessionType < Types::BaseObject
    field :id, ID, null: false
    field :workout_day_id, ID, null:true
    field :workout_set_sessions,[WorkoutSetSessionType], null: false
    field :notes, String, null: false
    field :grouped_workout_exercises, [GroupedWorkoutExerciseType], null: false

    def grouped_workout_exercises
      sessions = object.workout_set_sessions
      grouped = sessions.group_by { |session| session.workout_exercise_id }
      grouped_exercises = []
      grouped.each do |workout_exercise_id,rest|
        grouped_exercises.push(
          {
            workout_exercise_id: ,
            exercise_name: rest.first.exercise.name,
            sets: rest
          }
        )
      end
      grouped_exercises
    end
  end


end