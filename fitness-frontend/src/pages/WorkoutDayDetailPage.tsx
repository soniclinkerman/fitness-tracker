import {useLazyQuery, useMutation, useQuery} from "@apollo/client/react";
import {GET_WORKOUT_DAY} from "../graphql/queries/workoutDayQueries.ts";
import {useParams} from "react-router-dom";
import WorkoutExerciseCard from "../components/WorkoutExerciseCard.tsx";
import {GET_EXERCISES} from "../graphql/queries/exerciseQueries.ts";
import {useEffect, useRef, useState} from "react";
import type {ModalMode} from "../types/ModalMode.ts";
import {
    ADD_EXERCISE_TO_WORKOUT_DAY,
    DELETE_EXERCISE_TO_WORKOUT_DAY,
    UPDATE_WORKOUT_EXERCISES
} from "../graphql/mutations/workoutExerciseMutations.ts";
import Modal from "../components/ui/Modal.tsx";
import {PencilIcon, TrashIcon} from "@heroicons/react/24/outline";
import {PlusIcon} from "@heroicons/react/16/solid";
import BackButton from "../components/BackButton.tsx";
import {UPDATE_WORKOUT_DAY} from "../graphql/mutations/workoutDayMutations.ts";
import {CREATE_EXERCISE} from "../graphql/mutations/exerciseMutations.ts";
import {CATEGORY} from "../types/ExerciseCategoryEnum.ts";

interface WorkoutSetForm {
    id?: string;          // optional for updates
    weight: number;
    minReps: number;
    maxReps: number;
}
// Need to add a mutation and modal that allows the user to add exercises to a workout day
const WorkoutDayDetailPage = () => {
    const DEFAULT_SETS = 1
    const REPS_MIN = 3
    const REPS_MAX = 3
    const {dayId} = useParams()
    const {data, loading, error} = useQuery(GET_WORKOUT_DAY, {variables: {id: dayId}})



    const [selectedWorkoutExerciseId,setSelectedWorkoutExerciseId] = useState(null)
    const [updateWorkoutExercise] = useMutation(UPDATE_WORKOUT_EXERCISES, {
        refetchQueries: [
            { query: GET_WORKOUT_DAY, variables: { id: dayId } },
        ] as Parameters<typeof useMutation>[1]["refetchQueries"],
        onCompleted: () => {
            closeModal();
        },
        onError: (err) => {
            alert("Something went wrong: " + err.message);
        }
    })
    const [deleteWorkoutExercise] = useMutation(DELETE_EXERCISE_TO_WORKOUT_DAY, {
        refetchQueries: [
            { query: GET_WORKOUT_DAY, variables: { id: dayId } },
        ] as Parameters<typeof useMutation>[1]["refetchQueries"],
    })

    const [addExerciseToWorkoutDay, {loading: addExerciseLoading}] = useMutation(ADD_EXERCISE_TO_WORKOUT_DAY, {
        refetchQueries: [
            { query: GET_WORKOUT_DAY, variables: { id: dayId } },
        ] as Parameters<typeof useMutation>[1]["refetchQueries"],

        onCompleted: () => {
            closeModal();
        },
        onError: (err) => {
            alert("Something went wrong: " + err.message);
        },
    });


    const [updateWorkoutDay] = useMutation(UPDATE_WORKOUT_DAY, {
        refetchQueries: [
            { query: GET_WORKOUT_DAY, variables: { id: dayId } },
        ] as Parameters<typeof useMutation>[1]["refetchQueries"],
        onCompleted: () => {
            closeModal();
        },
        onError: (err) => {
            alert("Something went wrong: " + err.message);
        }
    })

    const [modalMode,setModalMode] = useState<ModalMode>('CLOSED')

    const [fetchExercises] = useLazyQuery(GET_EXERCISES)


    // INPUTS
    const [selectedExerciseId,setSelectedExerciseId] = useState<number>(null)
    const [setCount,setSetCount] = useState<number>(0)
    const [sets,setSets] = useState<WorkoutSetForm[]>([])
    const [searchTerm,setSearchTerm] = useState<string>("")

    const [selectedWorkoutDayId, setSelectedWorkoutDayId] = useState<number>(null)





    const [isDayEdit,setIsDayEdit] = useState<boolean>(false)
    const [dayName,setDayName] = useState<string>('')
    const { data: exerciseData } = useQuery(GET_EXERCISES);


    const [createExercise] = useMutation(CREATE_EXERCISE, {
        refetchQueries: [
            { query: GET_EXERCISES },
        ] as Parameters<typeof useMutation>[1]["refetchQueries"],


        onCompleted: ({createExercise}) => {
            setModalMode('CREATE')
            setSearchTerm(createExercise?.exercise?.name)
            setDropDownOpen(false)
            setSetCount(1)
            setSelectedExerciseId(createExercise?.exercise?.id)
        }
    })



    const filteredExercises = exerciseData?.exercises?.filter((ex) =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || exerciseData?.exercises;

    const [dropdownOpen, setDropDownOpen] = useState<boolean>(false)

    const myRef = useRef<HTMLDivElement | null>(null)

    const categoryOptions = Object.values(CATEGORY)

    const [exerciseName,setExerciseName] = useState("")
    const [description,setDescription] = useState("")
    const [category,setCategory] = useState(CATEGORY.UNCATEGORIZED)

    const handleExerciseAutoFill = (id: number) => {
        setSelectedExerciseId(id);
        const exercise = exerciseData.exercises.find(exercise => Number(exercise.id) === id)
        if (exercise) {
            setSetCount(exercise.defaultSets || DEFAULT_SETS); // Set the number of sets
            // Create an array of sets with default values for weight, reps, etc.
            const defaultSets = Array.from({ length: exercise.defaultSets||  DEFAULT_SETS }, (_, i) => ({
                id: undefined, // id is undefined initially
                weight: exercise.weight || 0, // Default weight
                minReps: exercise.defaultRepsMin || 0, // Default min reps
                maxReps: exercise.defaultRepsMax || 0, // Default max reps
            }));
            setSets(defaultSets); // Update the sets state with the default sets
        }
    };

    const closeModal = () => {
        setModalMode('CLOSED')
        setSearchTerm('')
        setSetCount(0);
        setSelectedWorkoutExerciseId(null)
        setSets([]);
        setSelectedExerciseId(null)
        setIsDayEdit(false)
        setSelectedExerciseId(null)
    }

    const editDayModal = (id) => {
        setIsDayEdit(true)
        setSelectedWorkoutDayId(id)
        setModalMode('UPDATE')

    }

    const editModal = (id) => {
        const workoutExercise = workoutExercises.find(we => we.id === id);
        if (!workoutExercise) return;
        const mappedSets = workoutExercise.workoutSets.map((s) => ({
            id: s.id,
            weight: s.plannedWeight ?? 0,
            minReps: s.targetRepsMin ?? 0,
            maxReps: s.targetRepsMax ?? 0,
        }));

        setSetCount(workoutExercise.workoutSets.length);
        setSets(mappedSets);

        setModalMode('UPDATE')
        setSelectedExerciseId(workoutExercise.exercise.id)
        setSelectedWorkoutExerciseId(workoutExercise.id)
    }

    const handleEdit = async (e: React.FormEvent)  => {
        e.preventDefault()
        if(isDayEdit)
        {
            await updateWorkoutDay({variables: {id:id, name: dayName}});
        }
        else {


            const formattedSets = sets.map((s) => {
                return {
                    id: s.id,
                    plannedWeight: s.weight,
                    targetRepsMin: s.minReps,
                    targetRepsMax: s.maxReps,
                };
            });

            const variables = {
                workoutExerciseId: selectedWorkoutExerciseId,
                exerciseId: selectedExerciseId,
                workoutSets: formattedSets, // not nested inside another "sets" key
            };

            await updateWorkoutExercise({variables});


        }
    }

    const handleDelete = (id) => {
        setSelectedWorkoutExerciseId(id);
        setModalMode('DELETE')
    }

    const handleSetCountChange = (newCount: number) => {
        setSets((prevSets) => {
            const updatedSets = [...prevSets];

            if (newCount > prevSets.length) {
                // Add new blank sets to the end
                const setsToAdd = Array.from(
                    { length: newCount - prevSets.length },
                    () => ({
                        id: undefined,
                        weight: 0,
                        minReps: 0,
                        maxReps: 0,
                    })
                );
                return [...updatedSets, ...setsToAdd];
            } else if (newCount < prevSets.length) {
                // Remove sets from the end
                return updatedSets.slice(0, newCount);
            }

            // No change
            return updatedSets;
        });

        setSetCount(newCount);
    };

    const updateSet = (index: number, field: string, value: number) => {
        const updated = [...sets];
        updated[index] = { ...updated[index], [field]: value };
        setSets(updated);
    };

    const  handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const variables = {
            workoutDayId: dayId,
            exerciseId: selectedExerciseId,
            workoutSetsAttributes: sets.map(s => ({
                plannedWeight: s.weight,
                targetRepsMax: s.maxReps,
                targetRepsMin: s.minReps
            }))
        }



        await addExerciseToWorkoutDay({variables: variables})

    }

    const removeSet = (index: number) => {
        setSets((prevSets) => {
            const updated = prevSets.filter((_, i) => i !== index);

            setSetCount(updated.length)
            return updated;
        });
    };

    const addSet = () => {
        setSets((prevSets) => {
            const lastSet = prevSets[prevSets.length-1]
            const newSet = { id: undefined, weight: lastSet.weight , minReps: lastSet.minReps, maxReps: lastSet.maxReps };
            const updatedSets = [...prevSets, newSet];

            // Immediately update the setCount based on the new length
            setSetCount(updatedSets.length);

            return updatedSets;
        });
    };

    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        // Allow only numbers and prevent leading zeroes
        const formattedValue = value.replace(/^0+/, "") // removes leading zeros
            .replace(/[^0-9]/g, ""); // removes non-numeric characters

        // Prevent negative numbers
        if (formattedValue === "" ) {
            updateSet(index, 'weight', Number(0));
        }
        else if(isNaN(Number(formattedValue)))
        {
            return;
        } else {
            updateSet(index, "weight", Number(formattedValue));
        }
    };

    const handleSetChange = (index: number, field: string, value: string) => {
        // Replace non-numeric characters and prevent leading zeroes
        const formattedValue = value.replace(/^0+/, "").replace(/[^0-9]/g, "");

        if (formattedValue === "" ) {
            updateSet(index, field, Number(0));
        }
        else if(isNaN(Number(formattedValue)))
        {
            return;
        }
        else {
            updateSet(index, field, Number(formattedValue));
        }
    };

    const handleFocus = () => {
        setDropDownOpen(true)
    }



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
                                                handleExerciseAutoFill(Number(ex.id));
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
                                >
                                    + Create new exercise
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Set count input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Sets
                </label>
                <input
                    type="number"
                    min={1}
                    value={setCount || ""}
                    onChange={(e) => handleSetCountChange(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>

            {/* Dynamic set inputs */}
            {sets.length > 0 && (
                <div className="space-y-3">
                    {/* Column labels */}
                    <div className="flex gap-3 items-center px-3 text-sm font-medium text-gray-600">
                        <span className="w-10">Set</span>
                        <span className="w-1/3">Weight (lbs)</span>
                        <span className="w-1/4">Min Reps</span>
                        <span className="w-1/4">Max Reps</span>
                    </div>

                    {/* Rows */}
                    {sets.map((set, i) => (
                        <div
                            key={i}
                            className="flex gap-4 items-center border border-gray-200 rounded-lg p-3 bg-gray-50"
                        >
                            <span className="text-gray-700 text-sm font-medium w-10">#{i + 1}</span>

                            <input
                                type="text"
                                placeholder="Weight"
                                value={set.weight}
                                onChange={(e) => handleWeightChange(e, i)}
                                className="border border-gray-300 rounded-lg p-2 w-1/3"
                            />
                            <input
                                type="text"
                                placeholder="Min"
                                value={set.minReps}
                                onChange={(e) => handleSetChange(i, "minReps", e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 w-1/4"
                            />
                            <input
                                type="text"
                                placeholder="Max"
                                value={set.maxReps}
                                onChange={(e) => handleSetChange(i, "maxReps", e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 w-1/4"
                            />

                            {/* Trash Icon for Delete */}
                            <TrashIcon
                                className="w-6 h-6 text-red-600 cursor-pointer"
                                onClick={() => removeSet(i)}
                            />
                        </div>
                    ))}

                    <div className="flex justify-center mt-4">
                        <button
                            type={"button"}
                            onClick={addSet}
                            className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700"
                        >
                            <PlusIcon className="w-20 h-7" />
                        </button>
                    </div>
                </div>
            )}


            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-3">
                <button
                    type="button"
                    onClick={() => setModalMode('CLOSED')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                    Cancel
                </button>
                <button
                    disabled={addExerciseLoading}
                    className={`text-white px-5 py-2.5 rounded-lg ${
                        addExerciseLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
                    }`}
                >
                    {addExerciseLoading ? "Saving..." : "Create"}
                </button>
            </div>
        </form>
    )

    const editModalContent = (
            <form onSubmit={handleEdit} className="space-y-4">
                {/* Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Exercise
                    </label>
                    <select
                        value={selectedExerciseId}
                        onChange={(e)=> setSelectedExerciseId(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                        <option value="">Select exercise</option>
                        {exerciseData?.exercises.map((ex) => (
                            <option key={ex.id} value={ex.id}>
                                {ex.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Set count input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Sets
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={setCount || ""}
                        onChange={(e) => handleSetCountChange(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"
                    />

                </div>

                {/* Dynamic set inputs */}
                {sets.length > 0 && (
                    <div className="space-y-3">
                        {/* Column labels */}
                        <div className="flex gap-3 items-center px-3 text-sm font-medium text-gray-600">
                            <span className="w-10">Set</span>
                            <span className="w-1/3">Weight (lbs)</span>
                            <span className="w-1/4">Min Reps</span>
                            <span className="w-1/4">Max Reps</span>
                        </div>

                        {/* Rows */}
                        {sets.map((set, i) => (
                            <div
                                key={i}
                                className="flex gap-4 items-center border border-gray-200 rounded-lg p-3 bg-gray-50"
                            >
                                <span className="text-gray-700 text-sm font-medium w-10">#{i + 1}</span>

                                <input
                                    type="text"
                                    placeholder="Weight"
                                    value={set.weight}
                                    onChange={(e) => handleWeightChange(e, i)}
                                    className="border border-gray-300 rounded-lg p-2 w-1/3"
                                />
                                <input
                                    type="text"
                                    placeholder="Min"
                                    value={set.minReps}
                                    onChange={(e) => handleSetChange(i, "minReps", e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 w-1/4"
                                />
                                <input
                                    type="text"
                                    placeholder="Max"
                                    value={set.maxReps}
                                    onChange={(e) => handleSetChange(i, "maxReps", e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 w-1/4"
                                />

                                {/* Trash Icon for Delete */}
                                <TrashIcon
                                    className="w-6 h-6 text-red-600 cursor-pointer"
                                    onClick={() => removeSet(i)}
                                />
                            </div>
                        ))}

                        {/* Add a set button at the bottom */}
                        <div className="flex justify-center mt-4">
                            <button
                                type={"button"}
                                onClick={addSet}
                                className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700"
                            >
                                <PlusIcon className="w-20 h-7" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-2 pt-3">
                    <button
                        type="button"
                        onClick={() => setModalMode('CLOSED')}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={addExerciseLoading}
                        className={`text-white px-5 py-2.5 rounded-lg ${
                            addExerciseLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
                        }`}
                    >
                        {addExerciseLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
    )


    const editDayModalContent = (
        <form onSubmit={handleEdit} className="space-y-4">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Name</label>

                <input
                    type="text"
                    placeholder={"Name"}
                    value={dayName}
                    onChange={(e) => setDayName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>



            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-3">
                <button
                    type="button"
                    onClick={() => setModalMode('CLOSED')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                    Cancel
                </button>
                <button
                    disabled={addExerciseLoading}
                    className={`text-white px-5 py-2.5 rounded-lg ${
                        addExerciseLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"
                    }`}
                >
                    {addExerciseLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    )

    const deleteModalContent = (
        <div>
            <h2>
                Are you sure you want to delete this program? This will remove it from your
                program.
            </h2>
<button onClick={async () => {
            try {
                closeModal();
                await deleteWorkoutExercise({variables: {id: selectedWorkoutExerciseId}});
            } catch (err) {
                console.error("Failed to delete:", err);
            }
        }}>Delete
        </button>
        <button onClick={closeModal}>Cancel</button>
</div>
    )

    const createExerciseContent = (
        <div>
    {/*FORM*/}
    <form className="max-w-sm mx-auto">
        <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Exercise Name</label>
            <input type="text"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                   placeholder="e.g., Incline Bench Press" required onChange={(e) => setExerciseName(e.target.value)}/>
        </div>
        <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Description (Optional)</label>
            <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" placeholder={'Add notes about form, texhnique, or variations...'} onChange={(e) => setDescription(e.target.value)}>

                            </textarea>
        </div>

        <div className="mb-5">
            <label
                className="block mb-2 text-sm font-medium text-gray-900 ">Category</label>
            <select id="categories"
                    value={category}
                    onChange={(e)=> setCategory(e.target.value as CATEGORY)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                {categoryOptions.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
        </div>

        <button
            className={"bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"}
            onClick={()=> setModalMode('CREATE')}
        >Cancel</button>
        <button
            type={"button"}
            className={"text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"}
            onClick={async () => {
                try {
                    const variables = { name: exerciseName, description, category }
                    await createExercise({variables: variables});
                } catch (err) {
                    console.error("Failed to delete:", err);

                }
            }}>Save To Library
        </button>
    </form>
        </div>
    )


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



    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
    if (error) return <p className="p-6 text-red-500">Error loading day.</p>;

    const {workoutDays} = data;
    const {id,name,dayNumber,workoutExercises} = workoutDays
    const exerciseCount = workoutExercises.length



    let modalTitle = ''
    let modalContent = null;
    switch(modalMode)
    {
        case "CREATE":
            modalTitle= "Add Exercise"
            modalContent=createModalContent
            break;
        case "UPDATE":
            if(isDayEdit)
            {
                modalTitle= "Edit Day"
                modalContent=editDayModalContent
            }
            else{
                modalTitle= "Edit Exercise"
                modalContent=editModalContent
            }
            break;
        case "DELETE":
            modalTitle= "Delete Exercise"
            modalContent=deleteModalContent
            break;

        case 'CREATE_EXERCISE':
            modalTitle= 'Create Exercise'
            modalContent=createExerciseContent
            break;
    }


    return(
        <div className="max-w-3xl mx-auto space-y-6 p-4">
            <BackButton/>
            <div className="mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Day {dayNumber} - {name}
                    </h1>
                    <PencilIcon onClick={()=> {
                        setDayName(name)
                        editDayModal(id)
                    }} className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                </div>


                <p className="text-sm text-gray-500">
                    {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}
                </p>


                <button
                    onClick={() => setModalMode('CREATE')}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                >
                    + Add Exercise To Day
                </button>

            </div>
            {workoutExercises.map((we) => (
                <WorkoutExerciseCard
                    key={we.id}
                    exerciseName={we.exercise.name}
                    category={we.exercise.category}
                    workoutSets={we.workoutSets}
                    onEdit={()=> editModal(we.id)}
                    onDelete={()=> {
                        handleDelete(we.id)
                    }}
                />

            ))}

            {modalMode !== "CLOSED" && (
                <Modal key={modalMode} onClose={closeModal} title={modalTitle}>
                    {modalContent}
                </Modal>
            )}


        </div>



    )

}

export default  WorkoutDayDetailPage