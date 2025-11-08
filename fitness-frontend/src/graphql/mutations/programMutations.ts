import {gql} from "@apollo/client";

export const CREATE_PROGRAM = gql`
mutation CreateProgram($name: String!, $description: String,$daysPerWeek: Int! )
{
  createProgram(input: {name: $name, description: $description, daysPerWeek: $daysPerWeek})
  {
    program{
      id
      name
      description
      daysPerWeek
    }
  }
}
`

export const DELETE_PROGRAM = gql`
mutation DeleteProgram($id: ID!)
{
  deleteProgram(input: {id: $id}){
    program{
      id
    }
  }
}
`

export const UPDATE_PROGRAM = gql`
mutation UpdateProgram($id: ID!, $name: String, $description: String, $daysPerWeek: Int)
{
  updateProgram(input: {id: $id, name: $name, description: $description, daysPerWeek: $daysPerWeek})
  {
    program{
      id
      name
      description
      daysPerWeek
    }
  }
}`