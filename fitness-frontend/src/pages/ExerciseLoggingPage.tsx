import BackButton from "../components/BackButton.tsx";
import {useEffect, useRef, useState} from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {useNavigate, useParams} from "react-router-dom";
import {
    DELETE_WORKOUT_SET_SESSIONS,
    UPDATE_WORKOUT_SET_SESSIONS
} from "../graphql/mutations/workoutSetSessionMutations.ts";
import {GET_EXERCISE_HISTORY} from "../graphql/queries/exerciseQueries.ts";
import _ from 'lodash';
import useWorkoutSession from "../hooks/useWorkoutSession.ts";
import Modal from "../components/ui/Modal.tsx";
import {TrashIcon} from "@heroicons/react/24/outline";
const LOG_STATE = {
    LOGGING: 'LOGGING',
    REVIEW: 'REVIEW'
}
export default function ExerciseLoggingPage() {
    const params = useParams();
    const navigate = useNavigate()
    const {sessionId, workoutExerciseId} = params

    const key = `${sessionId}${workoutExerciseId}`
    const { workoutSession, loading, error,refetch } = useWorkoutSession(sessionId, workoutExerciseId);

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [logState, setLogState] = useState(LOG_STATE.LOGGING)
    const [completedReps, setCompletedReps] = useState(0)
    const [completedWeight, setCompletedWeight] = useState(0)

    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentWorkoutData, setCurrentWorkoutData] = useState([]);

    const [historicalDataSet,setHistoricalDataSet] = useState([])
    const [deleteState,setDeleteState] = useState(false)

    const [selectedSet,setSelectedSet] = useState(null)

    const {data: historicalData,loading:historicalLoading, error:historicalError} = useQuery(GET_EXERCISE_HISTORY, {
        variables: {exerciseId: workoutSession?.workoutDaySession?.groupedWorkoutExercises[0].sets[0].exerciseId}
    })

    const addSet = () => {
        if (!currentWorkoutData.length) return;

        const lastSet = currentWorkoutData[currentWorkoutData.length - 1];
        if(lastSet.committed) lastSet.committed=true

        const setData = JSON.parse(localStorage.getItem(key) || "{}");

        const tempKeys = Object.keys(setData).filter(k => k.startsWith("temp-"));
        const nextTempId =
            tempKeys.length > 0
                ? Math.max(...tempKeys.map(k => Number(k.slice(5)))) + 1
                : 1;

        const tempId = `temp-${nextTempId}`;
        const order = currentWorkoutData.length + 1;

        const newSet = {
            id: tempId, // frontend identity only
            completedReps: lastSet.completedReps,
            completedWeight: lastSet.completedWeight,
            order
        };

        // persist FIRST
        setData[tempId] = {
            completedReps: newSet.completedReps,
            completedWeight: newSet.completedWeight,
            committed:false,
            order,
        };
        localStorage.setItem(key, JSON.stringify(setData));

        // then update UI ONCE
        setCurrentWorkoutData(prev => [...prev, newSet]);
    };


    useEffect(() => {
        if (!workoutSession || !workoutExerciseId) return;

        if (localStorage.getItem(`${sessionId}${workoutExerciseId}`)) {
            // build base sets
            const baseSets = workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets;
            const stored = JSON.parse(localStorage.getItem(key) || "{}");

            const results = baseSets.map((set) => {
                const storageData = stored[set.id]
                if (storageData) {
                    const completedWeight = storageData.completedWeight
                    const completedReps = storageData.completedReps
                    return {...set, completedWeight: completedWeight, completedReps: completedReps}
                    // finalSets.push(result)
                }
                return set
            })
            // merge localStorage
            let merged = [...results];

            // add temp sets
            Object.entries(stored).forEach(([id, value]) => {
                if (id.startsWith("temp-")) {
                    merged.push({
                        id,
                        completedReps: value.completedReps,
                        completedWeight: value.completedWeight,
                        order: merged.length + 1
                    });
                }
            });
            const setSize =  Object.keys(stored).length
            if(setSize)
            {
                setCompletedWeight(merged[setSize-1].completedWeight)
                setCompletedReps(merged[setSize-1].completedReps)
            }

            // compute index
            const lastCompletedIndex = Object.values(stored).reduce((last, set, idx) => {
                if (set.committed === true) {
                    return idx;
                }
                return last;
            }, -1);

            const nextIndex = Math.min(lastCompletedIndex + 1, merged.length - 1);

            setCurrentSetIndex(nextIndex)
            setCurrentWorkoutData(merged)
        }
        else{
            const sets = workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets
            setCurrentWorkoutData(sets)
        }

    }, [workoutSession?.id,workoutExerciseId])

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
        if (!currentWorkoutData.length) return;

        const allCommitted = currentWorkoutData.every(
            set => set.completedReps !== null
        );

        if (allCommitted) {
            setLogState(LOG_STATE.REVIEW);
        }
    }, [currentWorkoutData]);

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

    const [deleteWorkoutSetSession] = useMutation(DELETE_WORKOUT_SET_SESSIONS, {
        onCompleted: (data) =>{
            const {deleteWorkoutSetSession} = data
            const {workoutSets} = deleteWorkoutSetSession
            refetch()
            setIsModalOpen(false)
            setSelectedSet(null)
            setCurrentWorkoutData(workoutSets)

           // Toast Message Here
        }
    })





    const moveToNextSet = () => {
        const sets = workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets;
        const totalSets = sets.length;

        if (currentSetIndex >= totalSets - 1) return;

        const nextIndex = currentSetIndex + 1;
        const nextSet = sets[nextIndex];


        // Should likely put this in it's own method
        const setData = JSON.parse(localStorage.getItem(`${sessionId}${workoutExerciseId}`))
        if(setData)
        {
            setData[nextSet.id] = {completedReps: completedReps, completedWeight: completedWeight,committed:false}
            localStorage.setItem(`${sessionId}${workoutExerciseId}`,JSON.stringify(setData))
        }

        setCurrentSetIndex(nextIndex);
        // setCurrentWorkoutData((prev) => [...prev, nextSet]);
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
            setData[updated[currentSetIndex].id] = {
                completedReps: updated[currentSetIndex].completedReps,
                completedWeight: updated[currentSetIndex].completedWeight,
                committed: true
            }
            localStorage.setItem(`${sessionId}${workoutExerciseId}`,JSON.stringify(setData))

            return updated
        })
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

    const deleteSet = async (id) => {
        if(id.includes('temp'))
        {
            setCurrentWorkoutData(prev =>
                prev
                    .filter(set => set.id !== id)
                    .map((set, index) => ({ ...set, order: index + 1 }))
            );
            setIsModalOpen(false)
            setSelectedSet(null)

            const setData = JSON.parse(localStorage.getItem(key) || "{}");
            delete setData[id];
            localStorage.setItem(key, JSON.stringify(setData));
        }
        else{
            const variables = {id: id}
            try{
                const response = await deleteWorkoutSetSession({ variables });
                console.log("Set Deleted!", response);
                setSelectedSet(null)
                const setData = JSON.parse(localStorage.getItem(key) || "{}");
                delete setData[id];
                localStorage.setItem(key, JSON.stringify(setData));

            }
            catch (error) {
                console.error("Mutation error:", error);
            }
        }

    }

    const lockInSetInfo = async () => {
        const cleanedSet = currentWorkoutData.map((set, index) => {
            // This removes unwanted properties and adds the 'order' field
            const { __typename, exerciseId, id,committed, ...rest } = set;

            const isTemp = typeof id === "string" && id.startsWith("temp-");

            return {
                ...(isTemp ? rest : { ...rest, id }),
                order: index + 1,
            };
        });
        const variables = { sets: cleanedSet, workoutExerciseId: workoutExerciseId };
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
            const previous = setData[updated[index].id] || {};

            setData[updated[index].id] = {
                ...previous,
                completedReps: updated[index].completedReps, completedWeight: updated[index].completedWeight
            };
            localStorage.setItem(`${sessionId}${workoutExerciseId}`,JSON.stringify(setData))
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


    const unsavedChangesContent = (
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
    )


    const deleteSetContent = (
        <div className="flex flex-col gap-4">
            <span className="text-gray-700 text-sm">
                Are you sure you want to delete this set? This cannot be undone.
            </span>

            {/* Buttons Container */}
            <div className="flex flex-col gap-3">
                {/* Revert Changes Button */}
                <button
                    className="bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto w-full px-5 py-2.5 text-center"
                    onClick={()=> setIsModalOpen(false)}
                >
                    Cancel
                </button>

                {/* Save Changes Button */}
                <button
                    type="button"
                    disabled={loading}
                    className="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-danger-300 font-medium rounded-lg text-sm sm:w-auto w-full px-5 py-2.5 text-center"
                    onClick={()=> deleteSet(selectedSet)}
                >
                   Delete
                </button>
            </div>
        </div>
    )
    const modalContent = [
        {
            title: "Unsaved Changes",
            content: unsavedChangesContent
        },

        {
            title: "Delete Set",
            content: deleteSetContent
        },
    ]


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading workout session</div>;

    const exercise = workoutSession?.workoutDaySession?.groupedWorkoutExercises?.[0];
    if (!exercise) return <div>No exercise found.</div>;

    const { exerciseName, sets } = exercise;
    const totalSets = workoutSession.workoutDaySession.groupedWorkoutExercises[0].sets.length;
    const buttonLabel =
        currentSetIndex >= totalSets - 1 ? "Review All Sets" : "Complete Set";

    let hasUnsavedChanges = false;

    const hasBeenSavedBefore = sets.map(x => x.completedReps !== null && x.completedWeight !== null ).some(val => val)
    if(logState === LOG_STATE.REVIEW && hasBeenSavedBefore)
    {
        const diffSets = (a, b) => {
            const max = Math.max(a.length, b.length);
            const diffs = [];

            for (let i = 0; i < max; i++) {
                if (!_.isEqual(a[i], b[i])) {
                    diffs.push({
                        index: i,
                        left: a[i],
                        right: b[i],
                        fieldDiffs: _.reduce(a[i], (acc, val, key) => {
                            if (!_.isEqual(val, b[i]?.[key])) {
                                acc[key] = { left: val, right: b[i]?.[key] };
                            }
                            return acc;
                        }, {})
                    });
                }
            }

            return diffs;
        };

        console.log(diffSets(sets, currentWorkoutData));

        const normalizeForSaveCheck = (sets) =>
            sets.map(set => ({
                id: String(set.id),
                completedReps: set.completedReps ?? null,
                completedWeight: set.completedWeight ?? null,
                order: set.order,
            }));

         hasUnsavedChanges =
            !_.isEqual(
                normalizeForSaveCheck(sets),
                normalizeForSaveCheck(currentWorkoutData)
            );
         console.log("has Unsaved Changes: ", hasUnsavedChanges)
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
            {currentWorkoutData.slice(0, currentSetIndex).map((set, i) => (
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
                                const prev = setData[currentSet.id] || {};

                                setData[currentSet.id] = {
                                    ...prev,
                                    completedReps: Number(e.target.value),
                                    completedWeight,
                                };
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
                                const prev = setData[currentSet.id] || {};

                                setData[currentSet.id] = {
                                    ...prev,
                                    completedReps,
                                    completedWeight:Number(e.target.value),
                                };
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

                                <div className="flex flex-col justify-end">
                                    {/* Spacer to match label height */}
                                    <div className="h-5 mb-1" />

                                    <button
                                        onClick={() => {
                                            setIsModalOpen(true);
                                            setDeleteState(true);
                                            setSelectedSet(set.id);
                                        }}
                                        className="
      flex items-center justify-center
      w-13 h-13
      rounded-full
      text-gray-400
      hover:text-red-600
      hover:bg-red-50
      transition
    "
                                        aria-label="Delete set"
                                    >
                                        <TrashIcon className="w-20 h-20" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ADD SET BUTTON */}
                    <button
                        onClick={addSet}
                        className="
      w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl
      hover:bg-gray-50 transition
    "
                    >
                        + Add Set
                    </button>

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
                <Modal onClose={() => {
                    setIsModalOpen(false)
                    setDeleteState(false)
                }} title={hasUnsavedChanges ? modalContent[0].title : modalContent[1].title}>
                    {hasUnsavedChanges && !deleteState && modalContent[0].content}
                    {deleteState && modalContent[1].content}

                </Modal>
            )}
        </div>

    );
}