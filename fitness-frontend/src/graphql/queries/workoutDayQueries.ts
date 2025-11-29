import {gql} from "@apollo/client";

export const GET_WORKOUT_DAY = gql`
query GetWorkoutDay($id: ID!) {
  workoutDays(id: $id){
    id
    name
    dayNumber
    workoutExercises{
        id
        exercise{
          id
          name
          category
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
}`