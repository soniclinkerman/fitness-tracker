import {useQuery} from "@apollo/client/react";
import {GET_WORKOUT_SESSION} from "../graphql/queries/workoutSessionQueries.ts";
import {useEffect, useState} from "react";

export default function useWorkoutSession (sessionId,workoutExerciseId) {
    const { data, loading, error,refetch } = useQuery(GET_WORKOUT_SESSION, {
        variables: { id: sessionId, workoutExerciseId: workoutExerciseId },
    });

    const [workoutSession, setWorkoutSession] = useState(null); // Default to null

    useEffect(() => {
        if (data) setWorkoutSession(data.workoutSession);
    }, [data]);

    return {workoutSession, loading, error,refetch}
}