import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client/react";
import {GET_EXERCISE_HISTORY, GET_EXERCISES} from "../graphql/queries/exerciseQueries.ts";
import ExerciseHistoryCard from "../components/ui/ExerciseHistoryCard.tsx";
import BackButton from "../components/BackButton.tsx";

export default function ExerciseHistoryPage() {
    const params = useParams();
    const { exerciseId } = params;

    const { data, loading } = useQuery(GET_EXERCISE_HISTORY, {
        variables: { exerciseId },
    });

    const { data: exerciseData } = useQuery(GET_EXERCISES, {
        variables: { id: exerciseId },
    });

    if (loading) return <div className="p-6">Loading...</div>;

    const { exerciseHistory } = data;
    const exerciseName = exerciseData?.exercises?.[0]?.name;

    return (
        <div className="px-4 py-6 md:px-8">
            {/* Centered content on desktop */}
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header */}
                <div className="space-y-3">
                    <BackButton directory="/workout-history" />

                    <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
                        {exerciseName}
                    </h1>
                </div>

                {/* History Cards */}
                <div className="space-y-6 md:space-y-8">
                    {exerciseHistory.map((history) => (
                        <ExerciseHistoryCard
                            key={history.workoutSession.id}
                            exerciseHistory={history}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}