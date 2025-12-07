module Types
  class WorkoutDaySessionType < Types::BaseObject
    field :id, ID, null: false
    field :workout_day_id, ID, null:true
    field :workout_set_sessions,[WorkoutSetSessionType], null: false
    field :notes, String, null: false
    field :grouped_workout_exercises, [GroupedWorkoutExerciseType], null: false do
      argument :workout_exercise_id, ID, required: false
    end
    def grouped_workout_exercises(workout_exercise_id: nil)
      sessions = object.workout_set_sessions

      sessions = sessions.where(workout_exercise_id: workout_exercise_id) if workout_exercise_id.present?

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