import {gql} from "@apollo/client";

export const UPDATE_WORKOUT_SET_SESSIONS = gql`
    mutation UpdateWorkoutSetSession($sets: [WorkoutSetSessionInput!]!){
    updateWorkoutSetSessions(input:{sets: $sets})
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

