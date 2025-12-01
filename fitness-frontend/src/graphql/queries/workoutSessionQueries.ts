import {gql} from "@apollo/client";

export const GET_WORKOUT_SESSION = gql`
    query WorkoutSession($id: ID!){
      workoutSession(id:$id){
        id
        workoutDaySession{
          workoutDayId
          groupedWorkoutExercises
          {
            exerciseName
            sets {
              id
              targetRepsMin
              targetRepsMax
            }
          }
        }
      }
    }
    `