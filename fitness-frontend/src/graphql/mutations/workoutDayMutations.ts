import {gql} from "@apollo/client";

export const UPDATE_WORKOUT_DAY = gql`
mutation UpdateWorkoutDays($id: ID!, $name: String)
{
  updateWorkoutDay(input: {id: $id, name: $name})
  {
    workoutDay{
      id
      name
    }
  }
}
    `