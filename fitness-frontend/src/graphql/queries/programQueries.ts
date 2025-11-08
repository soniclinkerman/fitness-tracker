import { gql } from "@apollo/client";

export const GET_ALL_PROGRAMS = gql`
  query GetAllPrograms($id: ID) {
    programs(id: $id) {
      id
      name
      description
      workoutDays {
        id
        name
        dayNumber
      }
    }
  }
`;

export const GET_PROGRAM = gql`
  query GetProgram($id: ID) {
  programs(id:$id){
    id
    name
    description
    workoutDays
    {
      id
      name
      dayNumber
      completed
      workoutExercises{
        exercise{
          name
        }
        workoutSets{
          id
          setNumber
          targetRepsMin
          targetRepsMax
          plannedReps
          plannedWeight
          completedReps
          notes
          withinTargetRange
        }
      }
    }
  }
}
`;
