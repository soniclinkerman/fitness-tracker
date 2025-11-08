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