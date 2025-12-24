import BackButton from "../components/BackButton.tsx";
import {useEffect, useRef, useState} from "react";
import { GET_WORKOUT_SESSION } from "../graphql/queries/workoutSessionQueries.ts";
import {useMutation, useQuery} from "@apollo/client/react";
import {useNavigate, useParams} from "react-router-dom";
import {UPDATE_WORKOUT_SET_SESSIONS} from "../graphql/mutations/workoutSetSessionMutations.ts";
import {GET_EXERCISE_HISTORY} from "../graphql/queries/exerciseQueries.ts";
import _ from 'lodash';
import {retry} from "rxjs";
import useWorkoutSession from "../hooks/useWorkoutSession.ts";
import Modal from "../components/ui/Modal.tsx";
const LOG_STATE = {
    LOGGING: 'LOGGING',
    REVIEW: 'REVIEW'
}

export default function ExerciseLoggingPage() {
    const params = useParams();
    const navigate = useNavigate()
    const {sessionId, workoutExerciseId} = params

    const { workoutSession, loading, error } = useWorkoutSession(sessionId, workoutExerciseId);
    // const [workoutSession, setWorkoutSession] = useState();

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [logState, setLogState] = useState(LOG_STATE.LOGGING)
    const [completedReps, setCompletedReps] = useState(0)
    const [completedWeight, setCompletedWeight] = useState(0)

    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentWorkoutData, setCurrentWorkoutData] = useState([]);

    const [historicalDataSet,setHistoricalDataSet] = useState([])


    const hasPopulated = useRef(false)

    const {data: historicalData,loading:historicalLoading, error:historicalError} = useQuery(GET_EXERCISE_HISTORY, {
        variables: {exerciseId: workoutSession?.workoutDaySession?.groupedWorkoutExercises[0].sets[0].exerciseId}
    })




    useEffect(() => {
        if(currentWorkoutData.length < 1 || hasPopulated.current) return
        console.log(currentWorkoutData)

        if (localStorage.getItem(`${sessionId}${workoutExerciseId}`)) {
            const setData = JSON.parse(localStorage.getItem(`${sessionId}${workoutExerciseId}`) as string)
            const result = currentWorkoutData.map(set => {
                if(setData[set.id])
                {
                    return  {...set, completedReps: setData[set.id].completedReps, completedWeight: setData[set.id].completedWeight}
                }
                return set
            })
            console.log(setData)
            setCurrentWorkoutData(result)
            setCompletedReps(result[result.length-1].completedReps)
            setCompletedWeight(result[result.length-1].completedWeight)
            setCurrentSetIndex(result.length-1)
            hasPopulated.current=true
            if(result.length === workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets.length)
            {
                setLogState(LOG_STATE.REVIEW)
            }
        }
        else{
            console.log( workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets)
            // const firstSet =
            //     workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets[0];
            // setCurrentWorkoutData([firstSet]);
        }
    }, [currentWorkoutData]);


    // This runs when we have saved data. Normally happens when we've completed a workout
    // useEffect(() => {
    //     if (data) setWorkoutSession(data.workoutSession);
    // }, [data]);


    // This runs in the event we have previous from a users lift in the last session.
    // This can allow them to see what they did last week without needing to switch to the progress page
    useEffect(() => {
        if(historicalData && historicalData.exerciseHistory.length > 0)
        {
            const {sets} = historicalData.exerciseHistory[0]
            setHistoricalDataSet(sets)
        }
    }, [historicalData])


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

                const sets = JSON.parse(localStorage.getItem(`${sessionId}${workoutExerciseId}`))
                const finalSets = []
                if(sets) {
                    workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets.forEach((set) => {
                        const storageData = sets[set.id]
                        if (storageData) {
                            const completedWeight = storageData.completedWeight
                            const completedReps = storageData.completedReps
                            const result = {...set, completedWeight: completedWeight, completedReps: completedReps}
                            finalSets.push(result)
                        }
                    })
                }

                const currentSetList = finalSets.length > 0 ? finalSets : [firstSet];
                setCurrentWorkoutData(currentSetList);
            }
        }
    }, [workoutSession]);

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





    const moveToNextSet = () => {
        const sets = workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets;
        const totalSets = sets.length;

        if (currentSetIndex >= totalSets - 1) return;

        const nextIndex = currentSetIndex + 1;
        const nextSet = sets[nextIndex];

        console.log(completedWeight)
        const setData = JSON.parse(localStorage.getItem(`${sessionId}${workoutExerciseId}`))
        if(setData)
        {
            setData[nextSet.id] = {completedReps: completedReps, completedWeight: completedWeight}
            localStorage.setItem(`${sessionId}${workoutExerciseId}`,JSON.stringify(setData))
        }



        // console.log(storageSet)
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

            let setData = {}
            if (localStorage.getItem(`${sessionId}${workoutExerciseId}`)) {
                setData = JSON.parse(localStorage.getItem(`${sessionId}${workoutExerciseId}`) as string)
            }
            setData[updated[currentSetIndex].id] = {completedReps: updated[currentSetIndex].completedReps, completedWeight: updated[currentSetIndex].completedWeight}
            localStorage.setItem(`${sessionId}${workoutExerciseId}`,JSON.stringify(setData))

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
            if (localStorage.getItem(`${sessionId}${workoutExerciseId}`)) {
                localStorage.removeItem(`${sessionId}${workoutExerciseId}`)
            }

        } catch (error) {
            console.error("Mutation error:", error);
        }
    };

    const handleReviewEdit = (index, field, value) => {
        setCurrentWorkoutData(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };

            let setData = {}
            if (localStorage.getItem(`${sessionId}${workoutExerciseId}`)) {
                setData = JSON.parse(localStorage.getItem(`${sessionId}${workoutExerciseId}`) as string)
            }
            setData[updated[index].id] = {completedReps: updated[index].completedReps, completedWeight: updated[index].completedWeight}
            localStorage.setItem(`${sessionId}${workoutExerciseId}`,JSON.stringify(setData))

            // console.log(setData)
            return updated;
        });
    };

    const autoPopulateSet = (index) => {
        setCompletedWeight(historicalDataSet[index].completedWeight)
        setCompletedReps(historicalDataSet[index].completedReps)

    }

    const revertChanges = () => {
        setCurrentWorkoutData(sets)
        localStorage.removeItem(`${sessionId}${workoutExerciseId}`)
        navigate(`/workout-sessions/${workoutSession.id}`)
    }



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading workout session</div>;

    const exercise = workoutSession?.workoutDaySession?.groupedWorkoutExercises?.[0];
    if (!exercise) return <div>No exercise found.</div>;

    const { exerciseName, sets } = exercise;
    const totalSets = sets.length;

    const buttonLabel =
        currentSetIndex >= totalSets - 1 ? "Review All Sets" : "Complete Set";

    let hasUnsavedChanges = false;

    const hasBeenSavedBefore = sets.map(x => x.completedReps !== null && x.completedWeight !== null ).some(val => val)
    console.log(hasBeenSavedBefore)
    if(logState === LOG_STATE.REVIEW && hasBeenSavedBefore)
    {
            if(!_.isEqual(sets, currentWorkoutData))
            {
                hasUnsavedChanges=true
            }
    }

    const handleBack = () => {
        if(hasUnsavedChanges)
        {
            setIsModalOpen(true);
        }
        else{
            navigate(`/workout-sessions/${params.sessionId}`)
        }
    }

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <BackButton handleButton={handleBack}/>

            {/* TITLE */}
            <h1 className="text-2xl font-semibold mt-2">{exerciseName}</h1>

            {hasUnsavedChanges && (
                <span style={{ color: 'red', fontWeight: 'bold' }} className="text-sm">
                    Unsaved Changes
                </span>
            )}

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
                <div className="grid grid-cols-[auto_1fr_1fr] gap-4 mb-6">
                    {/* Auto-populate button */}
                    <div className="flex flex-col items-center">
                        {/* Spacer to match label height */}
                        <div className="h-5 mb-1" />

                        {(historicalDataSet[currentSetIndex] !== undefined) &&
                        <button
                            onClick={() => autoPopulateSet(currentSetIndex)}
                            title="Use last workout values"
                            className="
                h-10 w-10
                flex items-center justify-center
                rounded-lg
                border border-gray-300
                text-gray-500
                hover:text-teal-600 hover:border-teal-600
                transition
            "
                        >
                            ⟳
                        </button>
                        }
                    </div>


                    {/* Reps */}
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Reps</label>
                        <input
                            className="w-full border rounded-lg p-3 text-center"
                            type="number"
                            value={completedReps}
                            onChange={
                            (e) => {
                                const currentSet = currentWorkoutData[currentSetIndex]
                                setCompletedReps(Number(e.target.value))
                                let setData = {}
                                console.log(currentSet)
                                if (localStorage.getItem(`${sessionId}${workoutExerciseId}`)) {
                                    setData = JSON.parse(localStorage.getItem(`${sessionId}${workoutExerciseId}`) as string)
                                }
                                setData[currentSet.id] = {completedReps: Number(e.target.value), completedWeight: completedWeight}
                                localStorage.setItem(`${sessionId}${workoutExerciseId}`,JSON.stringify(setData))
                                console.log(setData)
                            }
                        }
                        />
                    </div>

                    {/* Weight */}
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Weight (lbs)</label>
                        <input
                            className="w-full border rounded-lg p-3 text-center"
                            type="number"
                            value={completedWeight}
                            onChange={(e) => {
                                const currentSet = currentWorkoutData[currentSetIndex]
                                setCompletedWeight(Number(e.target.value))
                                let setData = {}
                                if (localStorage.getItem(`${sessionId}${workoutExerciseId}`)) {
                                    setData = JSON.parse(localStorage.getItem(`${sessionId}${workoutExerciseId}`) as string)
                                }
                                setData[currentSet.id] = {completedReps: completedReps, completedWeight: Number(e.target.value)}
                                localStorage.setItem(`${sessionId}${workoutExerciseId}`,JSON.stringify(setData))
                            }}
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

            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} title={'Unsaved Changes'}>
                    <div className="flex flex-col gap-4">
            <span className="text-gray-700 text-sm">
                You have unsaved changes. Do you want to revert them or save?
            </span>

                        {/* Buttons Container */}
                        <div className="flex flex-col gap-3">
                            {/* Revert Changes Button */}
                            <button
                                className="bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto w-full px-5 py-2.5 text-center"
                                onClick={revertChanges}
                            >
                                Revert Changes
                            </button>

                            {/* Save Changes Button */}
                            <button
                                type="button"
                                disabled={loading}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto w-full px-5 py-2.5 text-center"
                                onClick={lockInSetInfo}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>

    );
}