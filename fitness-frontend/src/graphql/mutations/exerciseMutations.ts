import {gql} from "@apollo/client";

export const DELETE_EXERCISE = gql`
    mutation DeleteExercise($id: ID!){
      deleteExercise(input: {id:$id}){
        exercise
        {
          id
          name
          description
        }
      }
    }
`

export const CREATE_EXERCISE = gql`
    mutation CreateExercise($name: String!, $description:String,$defaultSets:Int, $defaultRepsMin: Int,$defaultRepsMax: Int, $category: ExerciseCategoryEnum){
      createExercise(input: {name: $name, description: $description, defaultSets: $defaultSets, defaultRepsMin: $defaultRepsMin, defaultRepsMax: $defaultRepsMax, category: $category})
      {
        exercise{
          id
          name
          description
          defaultSets
          defaultRepsMin
          defaultRepsMax
        }
      }
    }
`
export const UPDATE_EXERCISE = gql`
    mutation UpdateExercise($id: ID!, $name: String, $description: String, $defaultSets: Int, $defaultRepsMin: Int, $defaultRepsMax: Int, $category: ExerciseCategoryEnum){
      updateExercise(input: { id: $id, name: $name, description: $description, defaultSets: $defaultSets, defaultRepsMin: $defaultRepsMin, defaultRepsMax: $defaultRepsMax, category: $category })
      {
        exercise{
          id
          name
          category
          description
          defaultSets
          defaultRepsMin
          defaultRepsMax
        }
      }
    }
`