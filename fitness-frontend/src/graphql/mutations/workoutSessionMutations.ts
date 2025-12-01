import {gql} from "@apollo/client";

export const START_WORKOUT_SESSION = gql`
    mutation StartWorkoutSession {
      startWorkoutSession(input:{}) {
        workoutSession {
          id
          startedAt
          workoutDaySession {
            id
            workoutSetSessions {
              id
              exerciseId
              plannedWeight
              targetRepsMin
              targetRepsMax
            }
          }
        }
      }
    }`