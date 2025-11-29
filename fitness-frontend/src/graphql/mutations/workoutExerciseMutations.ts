import {gql} from "@apollo/client";

export const ADD_EXERCISE_TO_WORKOUT_DAY = gql`
mutation AddExerciseToWorkout($workoutDayId: ID!,$exerciseId:ID!, $workoutSetsAttributes: [WorkoutSetInput!]!){
  addWorkoutExercise(input: {workoutDayId: $workoutDayId,exerciseId: $exerciseId, workoutSetsAttributes: $workoutSetsAttributes})
  {
    workoutExercise
    {
      exercise{
      id
      name
    }
    workoutSets{
          id
          setNumber
          targetRepsMin
          targetRepsMax
          plannedReps
          plannedWeight
          notes
        }
      }
    }
    
}
`
export const UPDATE_WORKOUT_EXERCISES = gql`
mutation UpdateWorkoutSets($workoutExerciseId: ID!,$exerciseId: ID, $workoutSets: [WorkoutSetInput!]!){
  saveWorkoutSets(input: {workoutExerciseId: $workoutExerciseId, exerciseId: $exerciseId workoutSets: $workoutSets}){
   workoutSets{
    id
    completedWeight
    plannedReps
    plannedWeight
    targetRepsMin
    targetRepsMax
    completedWeight
  }
  }
}
`
export const DELETE_EXERCISE_TO_WORKOUT_DAY = gql`
mutation DeleteExerciseFromWorkoutDay($id: ID!){
  deleteWorkoutExercise(input: {id: $id})
  {
    workoutExercise
    {
      id
    }
  }
}
`

