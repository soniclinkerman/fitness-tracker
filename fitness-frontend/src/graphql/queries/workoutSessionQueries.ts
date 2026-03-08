import {gql} from "@apollo/client";

export const GET_WORKOUT_SESSION_FOR_PROGRESS = gql`
   query WorkoutSession($id: ID!){
  workoutSession(id:$id){
    id
    completedAt
    workoutDaySession{
      workoutDayId
      groupedWorkoutExercises
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

export const GET_COMPLETED_WORKOUT_SESSIONS = gql`
query {
  completedWorkoutSessions{
    id
    completedAt
    workoutDaySession{
      groupedWorkoutExercises
      {
        workoutExerciseId
      }
    }
  }
}
`

export const WORKOUTS_THIS_WEEK = gql`
    query WorkoutsThisWeek{
  workoutsThisWeek
}
    `