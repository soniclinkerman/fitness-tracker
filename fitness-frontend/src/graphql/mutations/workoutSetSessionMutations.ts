import {gql} from "@apollo/client";

export const UPDATE_WORKOUT_SET_SESSIONS = gql`
     mutation UpdateWorkoutSetSession($sets: [WorkoutSetSessionInput!]!, $workoutExerciseId: ID){
    updateWorkoutSetSessions(input:{sets: $sets, workoutExerciseId: $workoutExerciseId})
    {
      workoutSetSessions{
        id
        completedReps
        completedWeight
        isFailure
      }
    }
  }
  `

export const DELETE_WORKOUT_SET_SESSIONS = gql`
 mutation DeleteWorkoutSetSession($id: ID!){
    deleteWorkoutSetSession(input:{id: $id})
    {
      workoutSets{
        id
        completedReps
        completedWeight
        isFailure
        order
      }
    }
  }
`

