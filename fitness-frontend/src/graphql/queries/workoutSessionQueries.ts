import {gql} from "@apollo/client";

export const GET_WORKOUT_SESSION = gql`
    query WorkoutSession($id: ID!, $workoutExerciseId: ID){
  workoutSession(id:$id){
    id
    workoutDaySession{
      workoutDayId
      groupedWorkoutExercises(workoutExerciseId: $workoutExerciseId)
      {
        workoutExerciseId
        exerciseName
        sets {
          id
          exerciseId
          targetRepsMin
          targetRepsMax
          completedReps
          completedWeight
          order
        }
      }
    }
  }
}
    `

export const GET_ACTIVE_WORKOUT_SESSION = gql`
query FetchActiveWorkoutSession{
  activeWorkoutSession{
    id
    startedAt
    workoutDaySession{
      workoutDayId
    }
  }
  
}
`