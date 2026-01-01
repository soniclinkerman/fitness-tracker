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

export const START_QUICK_WORKOUT_SESSION = gql`
mutation START_QUICK_WORKOUT_SESSION{
  startQuickWorkoutSession(input: {}){
    workoutSession{
      id
      startedAt
      completedAt
      workoutDaySession{
        groupedWorkoutExercises{
          exerciseName
          sets{
            completedReps
            completedWeight
          }
        }
      }
     
    }
  }
}
`

export const ADD_EXERCISE_TO_WORKOUT_SESSION = gql`
mutation AddExerciseToWorkoutSession(
  $workoutSessionId: ID!
  $exerciseId: ID!
  $setCount: Int
) {
  addExerciseToWorkoutSession(
    input: { 
      workoutSessionId: $workoutSessionId
      exerciseId: $exerciseId
      setCount: $setCount
    }
   
  ) {
    workoutSession {
      id
      startedAt
      completedAt
      

      workoutDaySession {
        id
        groupedWorkoutExercises{
          workoutExerciseId
          exerciseName
          sets{
            completedReps
            completedWeight
          }
        }
       
      }
    }
  }
}
`