import {gql} from "@apollo/client";

export const SIGN_UP = gql`
mutation SignUp($name: String!, $email: String!, $password: String!) {                                                                                           
    signUp(input: {name: $name, email: $email, password: $password}) {                    
      token                                                                                            
    }                                                                                                  
  }`

export const SIGN_IN = gql`
mutation SignIn($email: String!, $password: String!) {                                                                                           
    signIn(input: {email: $email, password: $password}) {                    
      token                                                                                            
    }                                                                                                  
  }`

