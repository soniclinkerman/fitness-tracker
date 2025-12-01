import { useQuery } from "@apollo/client/react";
import { GET_WORKOUT_SESSION } from "../graphql/queries/workoutSessionQueries.ts";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton.tsx";

export default function WorkoutSessionPage() {
    const params = useParams();
    const { data, loading, error } = useQuery(GET_WORKOUT_SESSION, {
        variables: { id: params.id }
    });

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6">Error loading workout.</div>;

    const { workoutDaySession } = data.workoutSession;
    const { groupedWorkoutExercises } = workoutDaySession;

    return (
        <div className="p-4 w-full">

            <BackButton />

            {/* Title */}
            {/*<div className="mt-4 mb-6">*/}
            {/*    <h1 className="text-xl font-semibold">{workoutDaySession.workoutDay.name}</h1>*/}
            {/*    <p className="text-gray-500 text-sm">*/}
            {/*        {workoutDaySession.workoutDay.description || ""}*/}
            {/*    </p>*/}
            {/*</div>*/}

            {/* Divider */}
            <div className="h-[2px] bg-gray-100 mb-6"></div>

            {/* Exercise Cards */}
            <div className="space-y-4 w-full">
                {groupedWorkoutExercises.map((exercise, i) => {
                    const { exerciseName, sets } = exercise;

                    return (
                        <button
                            key={i}
                            className="
                        w-full
                        flex items-center justify-between
                        bg-white rounded-2xl
                        px-7 py-6
                        shadow-[0_1px_4px_rgba(0,0,0,0.06)]
                        hover:bg-gray-50 transition
                        border border-gray-100
                    "
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center
                            font-medium text-gray-700 text-sm">
                                    {i + 1}
                                </div>

                                <div>
                                    <p className="font-medium text-gray-900">{exerciseName}</p>
                                    <p className="text-sm text-gray-500">{sets.length} sets</p>
                                </div>
                            </div>

                            <span className="text-gray-400 text-lg">›</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}