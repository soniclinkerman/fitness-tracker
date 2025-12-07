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

export const COMPLETE_WORKOUT_SESSION = gql`
    mutation CompleteWorkoutSession{
  completeWorkoutSession(input: {}){
    sessionCompleted
    workoutSession{
      workoutDaySession{
        groupedWorkoutExercises{
          exerciseName
          sets {
          id
          exerciseId
          targetRepsMin
          targetRepsMax
          completedReps
          completedWeight
        }
      }
    }
  }
  }
 }
`