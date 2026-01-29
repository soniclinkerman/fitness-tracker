import {useLazyQuery, useMutation, useQuery} from "@apollo/client/react";
import {GET_ACTIVE_WORKOUT_SESSION, GET_WORKOUT_SESSION} from "../graphql/queries/workoutSessionQueries.ts";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton.tsx";
import {
    ADD_EXERCISE_TO_WORKOUT_SESSION,
    COMPLETE_WORKOUT_SESSION, DELETE_EXERCISE_FROM_WORKOUT_SESSION
} from "../graphql/mutations/workoutSessionMutations.ts";
import {GET_PROGRAM} from "../graphql/queries/programQueries.ts";
import {useEffect, useRef, useState} from "react";
import {TrashIcon} from "@heroicons/react/24/outline";
import {PlusIcon} from "@heroicons/react/16/solid";
import {GET_EXERCISES} from "../graphql/queries/exerciseQueries.ts";
import type {ModalMode} from "../types/ModalMode.ts";
import Modal from "../components/ui/Modal.tsx";

export default function WorkoutSessionPage() {
    const params = useParams();
    const navigate = useNavigate();
    const { data: exerciseData } = useQuery(GET_EXERCISES);

    // INPUTS
    const [selectedExerciseId,setSelectedExerciseId] = useState<number>(null)
    const [searchTerm,setSearchTerm] = useState<string>("")
    const [setCount,setSetCount] = useState<number>(null)
    const [dropdownOpen, setDropDownOpen] = useState<boolean>(false)
    const [modalMode,setModalMode] = useState<ModalMode>('CLOSED')

    const [workoutExerciseId,setWorkoutExerciseId] = useState(null)

    const resetInput = () => {
        setSelectedExerciseId(null)
        setSearchTerm('')
        setModalMode('CLOSED')
        setSetCount(null)
        setDropDownOpen(false)
        setWorkoutExerciseId(null)
    }

    const filteredExercises = exerciseData?.exercises?.filter((ex) =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || exerciseData?.exercises;



    const handleFocus = () => {
        setDropDownOpen(true)
    }
    const myRef = useRef<HTMLDivElement | null>(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const variables = {
            workoutSessionId: params.id,
            exerciseId: selectedExerciseId,
            setCount: Number(setCount)
        }
       await addExerciseToWorkoutSession({variables: variables})

    }

    useEffect(() => {
        const handleMouseDown = (e)=> {

            if( myRef.current && !myRef.current.contains(e.target as Node))
            {
                setDropDownOpen(false)
            }

        }
        document.addEventListener('mousedown', handleMouseDown);
        return ()=> document.removeEventListener('mousedown', handleMouseDown);
    }, [])

    // Refactor Later
    const handleSetCount = (input) => {

        if(input.trim() === "")
        {
            setSetCount(null)
            return
        }
        const number = Number(input)

        if(Number.isInteger(number) && number > 0)
        {
            setSetCount(input)
        }
        else{
            setSetCount('')
        }
    }



    const selectedExercise = filteredExercises?.find((exercise) => Number(exercise.id) === Number(selectedExerciseId))
    const isValidSetCount = setCount > 0
    const isValidExercise =selectedExercise?.name === searchTerm &&isValidSetCount


    const createModalContent = (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dropdown */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exercise
                </label>
                <div className="mb-5" ref={myRef}>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Exercise Name</label>

                    <input
                        type="text"
                        data-cy={"search-exercise-input"}
                        placeholder={"Search Exercises..."}
                        value={searchTerm}
                        onFocus={handleFocus}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    {dropdownOpen && (
                        <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-md relative overflow-hidden">
                            {/* Scrollable list */}
                            <div className="max-h-40 overflow-y-auto">
                                {filteredExercises?.length > 0 ? (
                                    filteredExercises.map((ex) => (
                                        <div
                                            key={ex.id}
                                            onClick={() => {
                                                setDropDownOpen(false);
                                                setSelectedExerciseId(ex.id)
                                                setSearchTerm(ex.name);
                                            }}
                                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex justify-between items-center transition-colors"
                                        >
                                            <span className="font-medium text-gray-700">{ex.name}</span>
                                            <span className="text-xs text-gray-500 uppercase">{ex.category}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="p-3 text-sm text-gray-500">No matches found.</p>
                                )}
                            </div>



                            {/* Fixed footer */}
                            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent border-t border-gray-200 shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => setModalMode('CREATE_EXERCISE')}
                                    className="w-full px-4 py-2 text-sm font-semibold text-teal-700 bg-white hover:bg-teal-50 transition-colors rounded-b-lg"
                                    data-cy="create-new-exercise-btn"
                                >
                                    + Create new exercise
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                { selectedExerciseId &&
                <input
                    data-cy={"set-count-input"}
                    type="text"
                    placeholder={"Set Count"}
                    value={setCount}
                    onChange={(e) => handleSetCount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"
                />
                }
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-3">
                <button

                    type="button"
                    onClick={resetInput}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    data-cy="add-exercise-cancel-btn"
                >
                    Cancel
                </button>
                <button
                    disabled={!isValidExercise}
                    data-cy={"add-exercise-btn"}


                    className={`text-white px-5 py-2.5 rounded-lg ${
                        isValidExercise ? "bg-blue-700 hover:bg-blue-800" : "bg-gray-400 cursor-not-allowed" 
                    }`}
                >
                    {"Add Exercise"}
                </button>
            </div>
        </form>
    )

    const deleteModalContent = (
        <div>
            <h2>
                Are you sure you want to delete this exercise? This will remove it from your
                session.
            </h2>
            <button onClick={async () => {
                try {

                    await deleteExerciseFromWorkoutSession({variables: {id: workoutExerciseId}});
                } catch (err) {
                    console.error("Failed to delete:", err);
                }
            }} data-cy="session-delete-exercise-confirm-btn">Delete
            </button>
            <button onClick={resetInput} data-cy="session-delete-exercise-cancel-btn">Cancel</button>
        </div>
    )


    const [addExerciseToWorkoutSession] = useMutation(ADD_EXERCISE_TO_WORKOUT_SESSION, {
        onCompleted: () => {
            resetInput()
        },
        refetchQueries: [
            {query: GET_WORKOUT_SESSION}
        ] as Parameters<typeof useMutation>[1]["refetchQueries"],

    })

    const [completeWorkoutSession] = useMutation(COMPLETE_WORKOUT_SESSION, {
        onCompleted: () => {
            Promise.resolve().then(() => navigate("/"));
        },
        refetchQueries: [
            { query: GET_ACTIVE_WORKOUT_SESSION },
        ] as Parameters<typeof useMutation>[1]["refetchQueries"],

    });

    const [deleteExerciseFromWorkoutSession] = useMutation(DELETE_EXERCISE_FROM_WORKOUT_SESSION, {
        onCompleted: () => {
            resetInput()
        },
        refetchQueries: [
            {query: GET_WORKOUT_SESSION}
        ] as Parameters<typeof useMutation>[1]["refetchQueries"],
    })

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

    const sortedExercises = [...groupedWorkoutExercises].sort((a,b) => a.workoutExerciseId-b.workoutExerciseId)
    const hasIncompleteSets = sortedExercises.some(exercise =>
        exercise.sets.some(
            set =>
                set.completedReps == null || set.completedWeight == null
        )
    );

    const isCompleteDisabled =
        sortedExercises.length === 0 || hasIncompleteSets;

    return (
        <div className="p-4 w-full">
            <BackButton directory={"/"}/>


            <div className="space-y-4 w-full">
                {sortedExercises.map((exercise, i) => {
                    const { exerciseName, sets } = exercise;
                    const orderedSets = [...sets].sort((a,b) => a.id-b.id)
                    const isDone = sets .every(
                        (s) => s.completedReps !== null && s.completedWeight !== null
                    );

                    return (
                        <button
                            onClick={() =>
                                navigate(`exercise/${exercise.workoutExerciseId}`)
                            }
                            data-cy={`${exerciseName}${exercise.workoutExerciseId}`}
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
                                                {orderedSets.map((set, idx) => (
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

                                <div className="flex items-center gap-3">
                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            console.log(exercise.workoutExerciseId)
                                            setWorkoutExerciseId(exercise.workoutExerciseId)
                                            e.stopPropagation(); // 🔴 CRITICAL
                                            e.preventDefault();
                                            setModalMode('DELETE')
                                        }}
                                        className="
            flex items-center justify-center
            w-9 h-9
            rounded-full
            text-gray-400
            hover:text-red-600
            hover:bg-red-50
            transition
        "
                                        aria-label="Delete exercise"
                                        data-cy="session-exercise-delete-btn"
                                    >
                                        🗑
                                    </button>

                                    {/* Chevron */}
                                    <span className="text-gray-400 text-lg">›</span>
                                </div>
                            </div>
                        </button>
                    );
                })}

                <button  data-cy={"add-exercise-btn"} onClick={()=> setModalMode('CREATE')}>Add Exercise</button>

                <button
                    onClick={completeWorkout}
                    disabled={isCompleteDisabled}
                    data-cy={"complete-workout-btn"}
                    className={`
    w-full py-4 rounded-xl mt-4
    flex items-center justify-center gap-2 text-lg
    transition shadow-sm

    ${
                        isCompleteDisabled
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-teal-600 text-white hover:bg-teal-700"
                    }
  `}
                >
                    Complete Workout
                </button>


                {modalMode !=='CLOSED' &&(
                    <div>
                        {modalMode === 'CREATE' &&
                            <Modal key={modalMode} onClose={resetInput} title={'Add Exercise'}>
                                {createModalContent}
                            </Modal>
                        }

                        {modalMode === 'DELETE' &&
                            <Modal key={modalMode} onClose={resetInput} title={'Delete Exercise'}>
                                {deleteModalContent}
                            </Modal>
                        }
                    </div>

                )
                }

            </div>
        </div>
    );
}