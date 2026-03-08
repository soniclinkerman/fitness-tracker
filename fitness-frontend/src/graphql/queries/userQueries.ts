import {gql} from "@apollo/client";

export const ME = gql`
    query{
  user{
    id
    name
    email
  }
}
    `