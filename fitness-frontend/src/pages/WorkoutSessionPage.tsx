import {useMutation, useQuery} from "@apollo/client/react";
import { GET_WORKOUT_SESSION } from "../graphql/queries/workoutSessionQueries.ts";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton.tsx";
import {COMPLETE_WORKOUT_SESSION} from "../graphql/mutations/workoutSessionMutations.ts";

export default function WorkoutSessionPage() {
    const params = useParams();
    const navigate = useNavigate();

    const [completeWorkoutSession] = useMutation(COMPLETE_WORKOUT_SESSION, {
        onCompleted: () => {
            Promise.resolve().then(() => navigate("/"));
        }
    });

    const { data, loading, error } = useQuery(GET_WORKOUT_SESSION, {
        variables: { id: params.id }
    });

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6">Error loading workout.</div>;
    if (!data || !data.workoutSession) return null;

    const { workoutDaySession } = data.workoutSession;
    const { groupedWorkoutExercises } = workoutDaySession;

    const completeWorkout = async () => {
        await completeWorkoutSession()
    }

    return (
        <div className="p-4 w-full">
            <BackButton directory={"/"}/>

            <div className="h-[2px] bg-gray-100 mb-6"></div>

            <div className="space-y-4 w-full">
                {groupedWorkoutExercises.map((exercise, i) => {
                    const { exerciseName, sets } = exercise;
                    const isDone = sets.every(
                        (s) => s.completedReps !== null && s.completedWeight !== null
                    );

                    return (
                        <button
                            onClick={() =>
                                navigate(`exercise/${exercise.workoutExerciseId}`)
                            }
                            key={exercise.workoutExerciseId}
                            className={`
                                w-full text-left
                                rounded-2xl px-5 py-5
                                shadow-[0_1px_4px_rgba(0,0,0,0.06)]
                                hover:bg-gray-50 transition
                                border 
                                ${
                                isDone
                                    ? "border-green-300 bg-green-50/30"
                                    : "border-gray-100 bg-white"
                            }
                            `}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-4 w-full">
                                    {/* Counter Bubble */}
                                    <div
                                        className={`
                                            w-9 h-9 rounded-full flex items-center justify-center 
                                            font-medium text-sm
                                            ${
                                            isDone
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                        }
                                        `}
                                    >
                                        {i + 1}
                                    </div>

                                    {/* Text */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-900">
                                                {exerciseName}
                                            </p>

                                            {isDone && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                    Done
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-500">
                                            {sets.length} sets × {sets[0]?.targetRepsMin || "?"}–{sets[0]?.targetRepsMax || "?"} reps
                                        </p>

                                        {/* Completed set badges */}
                                        {isDone && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {sets.map((set, idx) => (
                                                    <span
                                                        key={set.id}
                                                        className="
                                                            px-3 py-1 border border-green-300 text-green-700
                                                            text-xs rounded-lg bg-white
                                                        "
                                                    >
                                                        Set {idx + 1}: {set.completedReps} {set.completedReps === 1 ? "rep" : "reps"} @{" "}
                                                        {set.completedWeight}lbs
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <span className="text-gray-400 text-lg">›</span>
                            </div>
                        </button>
                    );
                })}

                <button
                    onClick={completeWorkout}
                    className="
      w-full bg-teal-600 text-white py-4 rounded-xl mt-4
      flex items-center justify-center gap-2 text-lg
      hover:bg-teal-700 transition shadow-sm
    "
                >
                    Complete Workout
                </button>
            </div>
        </div>
    );
}