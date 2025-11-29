# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject

    # TODO: remove me
    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World"
    end

    field :create_exercise, mutation: Mutations::Exercises::CreateExercise
    field :update_exercise, mutation: Mutations::Exercises::UpdateExercise
    field :delete_exercise, mutation: Mutations::Exercises::DeleteExercise
    field :create_program, mutation: Mutations::Programs::CreateProgram
    field :create_workout_day, mutation: Mutations::WorkoutDays::CreateWorkoutDay
    field :add_exercise, mutation: Mutations::WorkoutDays::AddExercise
    field :save_workout_sets, mutation: Mutations::WorkoutSets::SaveWorkoutSets
    field :add_workout_exercise, mutation: Mutations::WorkoutExercises::AddWorkoutExercise
    field :delete_workout_exercise, mutation: Mutations::WorkoutExercises::DeleteWorkoutExercise
    field :delete_program, mutation: Mutations::Programs::DeleteProgram
    field :update_program, mutation: Mutations::Programs::UpdateProgram
    field :update_workout_day, mutation: Mutations::WorkoutDays::UpdateWorkoutDay

    field :start_workout_session, mutation: Mutations::WorkoutSessions::StartWorkoutSession
    field :update_workout_set_sessions, mutation: Mutations::WorkoutSetSessions::UpdateWorkoutSetSessions
    field :complete_workout_day, mutation: Mutations::WorkoutDays::CompleteWorkoutDay
    field :complete_workout_session, mutation: Mutations::WorkoutSessions::CompleteWorkoutSession

  end
end
