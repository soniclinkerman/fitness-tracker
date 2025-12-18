import BackButton from "../components/BackButton.tsx";
import { useEffect, useState } from "react";
import { GET_WORKOUT_SESSION } from "../graphql/queries/workoutSessionQueries.ts";
import {useMutation, useQuery} from "@apollo/client/react";
import {useNavigate, useParams} from "react-router-dom";
import {UPDATE_WORKOUT_SET_SESSIONS} from "../graphql/mutations/workoutSetSessionMutations.ts";

const LOG_STATE = {
    LOGGING: 'LOGGING',
    REVIEW: 'REVIEW'
}
export default function ExerciseLoggingPage() {
    const [logState, setLogState] = useState(LOG_STATE.LOGGING)
    const [completedReps, setCompletedReps] = useState(0)
    const [completedWeight, setCompletedWeight] = useState(0)
    const [workoutSession, setWorkoutSession] = useState();
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentWorkoutData, setCurrentWorkoutData] = useState([]);

    const params = useParams();
    const navigate = useNavigate()
    const {sessionId, workoutExerciseId} = params

    const { data, loading, error } = useQuery(GET_WORKOUT_SESSION, {
        variables: { id: sessionId, workoutExerciseId: workoutExerciseId },
    });

    const handleReviewState = () =>
    {
        setCurrentWorkoutData(workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets)
        setLogState(LOG_STATE.REVIEW)
    }


    const [updateWorkoutSetSession] = useMutation(UPDATE_WORKOUT_SET_SESSIONS, {
        onCompleted: () =>{
            navigate(`/workout-sessions/${params.sessionId}`)
        }
    })

    useEffect(() => {
        if (data) setWorkoutSession(data.workoutSession);
    }, [data]);

    useEffect(() => {
        if (workoutSession) {
            const hasFinished = workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets.map(x => x.completedReps > 0).every(val => val)
            if(hasFinished)
            {
                handleReviewState()
            }
            else {
                const firstSet =
                    workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets[0];
                setCurrentWorkoutData([firstSet]);
            }
        }
    }, [workoutSession]);

    const moveToNextSet = () => {
        const sets = workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets;
        const totalSets = sets.length;

        if (currentSetIndex >= totalSets - 1) return;

        const nextIndex = currentSetIndex + 1;
        const nextSet = sets[nextIndex];

        setCurrentSetIndex(nextIndex);
        setCurrentWorkoutData((prev) => [...prev, nextSet]);
    };

    const updateCurrentSet = () => {
        setCurrentWorkoutData((prev) => {
            const updated = [...prev];
            const setToUpdate = {
                ...updated[currentSetIndex],
                completedWeight,
                completedReps
            };
            updated[currentSetIndex] = setToUpdate
            return updated
        })
        // setCompletedWeight(0)
        // setCompletedReps(0)
    }

    const handleNextSet = () => {
        const sets = workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets;
        const totalSets = sets.length;
        updateCurrentSet()
        if (currentSetIndex >= totalSets - 1)
        {
            setLogState(LOG_STATE.REVIEW)
        }
        else{
            moveToNextSet()
        }
    }

    const lockInSetInfo = async () => {
        const cleanedSet = currentWorkoutData.map((set,index) => {
            // This removes unwanted properties and adds the 'order' field
            const {__typename, exerciseId, ...rest} = set
            return {
                ...rest,
                order: index+1
            }
        })
        const variables = { sets: cleanedSet };
        try {
            const response = await updateWorkoutSetSession({ variables });
            console.log("Updated!", response);
        } catch (error) {
            console.error("Mutation error:", error);
        }
    };

    const handleReviewEdit = (index, field, value) => {
        setCurrentWorkoutData(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    if (loading) return <div>Loading...</div>;

    const exercise = workoutSession?.workoutDaySession?.groupedWorkoutExercises?.[0];
    if (!exercise) return <div>No exercise found.</div>;

    const { exerciseName, sets } = exercise;
    const totalSets = sets.length;

    const buttonLabel =
        currentSetIndex >= totalSets - 1 ? "Review All Sets" : "Complete Set";

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <BackButton />

            {/* TITLE */}
            <h1 className="text-2xl font-semibold mt-2">{exerciseName}</h1>

            {logState === LOG_STATE.LOGGING &&
                <div>
            {/* PROGRESS BAR */}
            <div className="mt-4 bg-gray-200 h-2 rounded-full">
                <div
                    className="h-2 bg-teal-600 rounded-full transition-all"
                    style={{ width: `${((currentSetIndex + 1) / totalSets) * 100}%` }}
                />
            </div>


            <p className="text-right text-sm text-gray-600 mt-1">
                {currentSetIndex + 1}/{totalSets}
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">Log Your Sets</h2>

            {/* COMPLETED SETS */}
            {currentWorkoutData.slice(0, -1).map((set, i) => (
                <div
                    key={i}
                    className="
                        bg-green-50 border border-green-300 rounded-xl p-4 mb-3
                        flex flex-col
                    "
                >
                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                        <span className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">
                            ✓
                        </span>
                        Set {i + 1}
                    </div>
                    <p className="text-gray-700 mt-1 text-sm">
                        {set.completedReps || 0} reps × {set.completedWeight || 0} lbs
                    </p>
                </div>
            ))}

            {/* CURRENT SET CARD */}
            <div
                className="
                    border border-teal-600 rounded-xl p-5 bg-white shadow-sm mb-10
                "
            >
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-3">
                    <span className="bg-teal-600 text-white text-xs px-3 py-1 rounded-full">
                        CURRENT
                    </span>
                    <p className="font-semibold text-gray-700">
                        Set {currentSetIndex + 1}
                    </p>
                </div>

                {/* INPUT GRID */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Reps</label>
                        <input
                            className="w-full border rounded-lg p-3 text-center"
                            type="number"
                            defaultValue={currentWorkoutData[currentSetIndex]?.completedReps || 0}
                            onChange={(e) => setCompletedReps(Number(e.target.value))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Weight (lbs)</label>
                        <input
                            className="w-full border rounded-lg p-3 text-center"
                            type="number"
                            defaultValue={currentWorkoutData[currentSetIndex]?.completedWeight || 0}
                            onChange={(e) => setCompletedWeight(Number(e.target.value))}
                        />
                    </div>
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleNextSet}
                    className="
                        w-full bg-teal-600 text-white py-3 rounded-xl
                        flex items-center justify-center gap-2
                        hover:bg-teal-700 transition
                    "
                >
                    <span>✓</span> {buttonLabel}
                </button>
            </div>

                </div>
            }

            {logState === LOG_STATE.REVIEW &&

                <div className="mt-6 space-y-6">
                    {/* TITLE */}
                    <h2 className="text-lg font-semibold text-gray-800">Review Your Sets</h2>

                    {/* SET LIST */}
                    <div className="space-y-4">
                        {currentWorkoutData.map((set, idx) => (
                            <div
                                key={set.id || idx}
                                className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
                            >
                                {/* Set Number */}
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-medium m-auto">
                                    {idx + 1}
                                </div>

                                {/* Inputs */}
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    {/* Reps */}
                                    <div>
                                        <label className="text-sm text-gray-500 block mb-1">Reps</label>
                                        <input
                                            type="number"
                                            value={set.completedReps || ""}
                                            onChange={(e) => handleReviewEdit(idx, "completedReps", Number(e.target.value))}
                                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        />
                                    </div>

                                    {/* Weight */}
                                    <div>
                                        <label className="text-sm text-gray-500 block mb-1">Weight (lbs)</label>
                                        <input
                                            type="number"
                                            value={set.completedWeight || ""}
                                            onChange={(e) => handleReviewEdit(idx, "completedWeight", Number(e.target.value))}
                                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Delete Button */}
                                {/*<button*/}
                                {/*    onClick={() => removeSet(idx)}*/}
                                {/*    className="text-red-500 hover:text-red-700 mt-2"*/}
                                {/*>*/}
                                {/*    🗑*/}
                                {/*</button>*/}
                            </div>
                        ))}
                    </div>

                    {/* ADD SET BUTTON */}
    {/*                <button*/}
    {/*                    onClick={addSet}*/}
    {/*                    className="*/}
    {/*  w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl*/}
    {/*  hover:bg-gray-50 transition*/}
    {/*"*/}
    {/*                >*/}
    {/*                    + Add Set*/}
    {/*                </button>*/}

                    {/* SAVE EXERCISE CTA */}
                    <button
                        onClick={lockInSetInfo}
                        className="
      w-full bg-teal-600 text-white py-4 rounded-xl mt-4
      flex items-center justify-center gap-2 text-lg
      hover:bg-teal-700 transition shadow-sm
    "
                    >
                        ✓ Save Exercise
                    </button>
                </div>
            }
        </div>

    );
}