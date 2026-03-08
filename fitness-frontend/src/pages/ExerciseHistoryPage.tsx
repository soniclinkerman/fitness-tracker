import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client/react";
import ExerciseHistoryCard from "../components/ui/ExerciseHistoryCard.tsx";
import BackButton from "../components/BackButton.tsx";
import {GET_WORKOUT_SESSION_FOR_PROGRESS} from "../graphql/queries/workoutSessionQueries.ts";

export default function ExerciseHistoryPage() {
    const params = useParams();
    const {workoutSessionId} = params;

    const {data, loading} = useQuery(GET_WORKOUT_SESSION_FOR_PROGRESS, {
        variables: {id: workoutSessionId},
    });

    if (loading) return (
        <div className="p-6 max-w-4xl mx-auto">
            <p className="text-gray-500">Loading...</p>
        </div>
    );

    const {workoutSession} = data;
    const completedDate = new Date(workoutSession.completedAt);
    const formattedDate = completedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const exerciseCount = workoutSession.workoutDaySession.groupedWorkoutExercises.length;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <BackButton directory="/workout-history"/>
            </div>

            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">{formattedDate}</h1>
                <p className="text-gray-500">{exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}</p>
            </div>

            <div className="space-y-6">
                {workoutSession.workoutDaySession.groupedWorkoutExercises.map((exercise) => (
                    <div key={exercise.workoutExerciseId}>
                        <h2 className="text-lg font-medium text-gray-800 mb-3">{exercise.exerciseName}</h2>
                        <ExerciseHistoryCard data={exercise}/>
                    </div>
                ))}
            </div>

            {exerciseCount === 0 && (
                <div className="text-center py-10 text-gray-500">
                    <p>No exercises recorded for this session.</p>
                </div>
            )}
        </div>
    );
}
