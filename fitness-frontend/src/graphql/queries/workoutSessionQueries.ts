import {gql} from "@apollo/client";

export const START_WORKOUT_SESSION = gql`
    mutation {
      startWorkoutSession(
        input: {
          userId: 14
          programId: "1"
          workoutDayId: "1"
        }
      ) {
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
    }

    `