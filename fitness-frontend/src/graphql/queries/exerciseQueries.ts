import {gql} from "@apollo/client";

export const GET_EXERCISES = gql`
query GET_EXERCISE($id: ID){
    exercises(id: $id) {
      id
      name
      description
      category
      defaultSets
      defaultRepsMin
      defaultRepsMax
    }
  }

`;

export const GET_EXERCISE_HISTORY = gql`
query GET_EXERCISE_HISTORY($exerciseId: ID!){
  exerciseHistory(exerciseId: $exerciseId){
    workoutSession{
      id
      updatedAt
      
    }
    sets{
      id
      userId
      exerciseId
      completedReps
      completedWeight
      performedAt
    }
  }
}
`