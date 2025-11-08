
import { GET_EXERCISES} from "../graphql/queries/exerciseQueries";
import ExerciseCard from "./ExerciseCard";
import type {Exercise} from "../types/Exercise.ts";
import {useMutation, useQuery} from "@apollo/client/react";
import {useState} from "react";
import Modal from "./ui/Modal.tsx";
import {CREATE_EXERCISE, DELETE_EXERCISE, UPDATE_EXERCISE} from "../graphql/mutations/exerciseMutations.ts";
import {CATEGORY} from "../types/ExerciseCategoryEnum.ts";
import ExerciseCategoryFilter from "./ExerciseCategoryFilter.tsx";

interface FetchExercisesData { exercises: Exercise[] }
const ExerciseList = () => {
    const categoryOptions = Object.values(CATEGORY)

    const [id,setId] = useState<Number | null>(null)
    const [name,setName] = useState("")
    const [description,setDescription] = useState("")
    const [category,setCategory] = useState(CATEGORY.UNCATEGORIZED)


    const [defaultSets,setDefaultSets] = useState<number | undefined>()
    const [defaultRepsMin,setDefaultRepsMin] = useState<number | undefined>()
    const [defaultRepsMax,setDefaultRepsMax] = useState<number | undefined>()

    const [showDefaults,setShowDefaults] = useState<boolean>(false)
    //We can probably remove this in the future and rely soley on the modal state to determine if it's open
    const [modalOpen,setModalOpen] = useState<boolean>(false)
    const [modalMode,setModalMode] = useState<'CREATE'| 'UPDATE'| 'DELETE' | null>(null)
    const [selectedExercise,setSelectedExercise] = useState<Exercise | null>(null)

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)




    // Mutations
    const [createExercise] = useMutation(CREATE_EXERCISE, {
        refetchQueries: [{ query:GET_EXERCISES}]
    })

    const [updateExercise] = useMutation(UPDATE_EXERCISE, {
        refetchQueries: [{query: GET_EXERCISES}]
    })
    const [deleteExercise] = useMutation(DELETE_EXERCISE, {
        refetchQueries: [{ query: GET_EXERCISES }],
    });


    const closeModal = () => {
        setModalOpen(false);
        setModalMode(null);
        setSelectedExercise(null);
        setShowDefaults(false)
        setName("");
        setDescription("");
        setCategory(CATEGORY.UNCATEGORIZED);
        setShowDefaults(false);
        setDefaultSets(undefined);
        setDefaultRepsMin(undefined);
        setDefaultRepsMax(undefined);
        setId(null)

    }
    const openDelete = (exercise: Exercise) => {
        setModalMode('DELETE')
        setModalOpen(true)
        setSelectedExercise(exercise)
    }

    const openCreate = () => {
        setModalMode('CREATE')
        setModalOpen(true)
    }

    const openEdit = (exercise: Exercise) => {
        const {id, name, description, category, defaultSets, defaultRepsMin, defaultRepsMax} = exercise;



        setId(id)
        setName(name)
        setDescription(description)
        setCategory(category as CATEGORY)
        setDefaultSets(defaultSets)
        setDefaultRepsMin(defaultRepsMin)
        setDefaultRepsMax(defaultRepsMax)

        setModalMode('UPDATE')
        setModalOpen(true)
        setShowDefaults(defaultSets !== null || defaultRepsMin !==null || defaultRepsMax!==null)
    }

    const {data, loading} = useQuery<FetchExercisesData>(GET_EXERCISES)
    if(loading) return <h3>Loading...</h3>

    const {exercises} = data!
    const filteredExercises = selectedCategory ? exercises.filter(exercise => exercise.category === selectedCategory) : exercises

    return (
        <div className="max-w-5xl mx-auto space-y-4 p-4">

            <button
                onClick={() => openCreate()}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
                + Add Exercise
            </button>

           <ExerciseCategoryFilter selectedCategory={selectedCategory} onSelect={(cat) => setSelectedCategory(cat)}/>

            {filteredExercises.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} onEdit={() => openEdit(ex)} onDelete={() => openDelete(ex)}/>
            ))}

            {/*CREATE*/}
            {modalMode == 'CREATE' && (
                <Modal  onClose={closeModal} title={'Create New Exercise'}>
                    <h2>
                        Add to your exercise library
                    </h2>



                    {/*FORM*/}
                    <form className="max-w-sm mx-auto">
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Exercise Name</label>
                            <input type="text"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                   placeholder="e.g., Incline Bench Press" required onChange={(e) => setName(e.target.value)}/>
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

                        <div className="mb-5">
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 ">Default Values</label>

                            Pre-fill sets and reps when adding to workouts
                            <div>
                                <input type={"checkbox"} onClick={() => setShowDefaults(!showDefaults)} />
                            </div>
                        </div>


                        {showDefaults && (
                            <div>

                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Default Sets </label>
                            <input type="number"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                   onChange={(e) => setDefaultSets(Number(e.target.value))}/>
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Default Reps Min </label>
                            <input type="number"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                   onChange={(e) => setDefaultRepsMin(Number(e.target.value))}/>
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Default Reps Max </label>
                            <input type="number"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                    onChange={(e) => setDefaultRepsMax(Number(e.target.value))}/>
                        </div>
                            </div>
                        )}





                        <button
                            className={"bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"}

                            onClick={closeModal}
                        >Cancel</button>
                        <button
                            className={"text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"}
                            onClick={async () => {
                            try {
                                const variables = showDefaults
                                    ? { name, description, category, defaultSets, defaultRepsMin, defaultRepsMax }
                                    : { name, description, category };
                                closeModal();
                                await createExercise({variables: variables});
                            } catch (err) {
                                console.error("Failed to delete:", err);

                            }
                        }}>Save To Library
                        </button>


                    </form>





                </Modal>
            )}

            {/*UPDATE*/}
            {modalOpen && modalMode == 'UPDATE' && (
                <Modal open={modalOpen} onClose={closeModal} title={'Edit Exercise'}>
                    <h2>
                       Update exercise details
                    </h2>

                    {/*FORM*/}
                    <form className="max-w-sm mx-auto">
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Exercise Name</label>
                            <input value={name} type="text"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                   placeholder="e.g., Incline Bench Press" required onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Description (Optional)</label>
                            <textarea value={description}  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" placeholder={'Add notes about form, texhnique, or variations...'} onChange={(e) => setDescription(e.target.value)}>

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

                        <div className="mb-5">
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900 ">Default Values</label>

                            Pre-fill sets and reps when adding to workouts
                            <div>
                                <input
                                    type={"checkbox"}
                                    onChange={() => {
                                        if (showDefaults) {
                                            // turning OFF
                                            setShowDefaults(false);
                                            setDefaultSets(null);
                                            setDefaultRepsMin(null);
                                            setDefaultRepsMax(null);
                                        } else {
                                            // turning ON
                                            setShowDefaults(true);
                                        }
                                    }}
                                    checked={showDefaults}
                                />
                            </div>
                        </div>


                        {showDefaults && (
                            <div>

                                <div className="mb-5">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Default Sets </label>
                                    <input value={defaultSets}  type="number"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                           onChange={(e) => setDefaultSets(Number(e.target.value))}/>
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Default Reps Min </label>
                                    <input value={defaultRepsMin}  type="number"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                           onChange={(e) => setDefaultRepsMin(Number(e.target.value))}/>
                                </div>
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Default Reps Max </label>
                                    <input  value={defaultRepsMax} type="number"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                           onChange={(e) => setDefaultRepsMax(Number(e.target.value))}/>
                                </div>
                            </div>
                        )}





                        <button
                            className={"bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"}

                            onClick={closeModal}
                        >Cancel</button>
                        <button
                            className={"text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"}
                            onClick={async () => {
                                try {
                                    console.log(category)
                                    const variables = showDefaults
                                        ? {
                                            id: id,
                                            name,
                                            description,
                                            category,
                                            defaultSets,
                                            defaultRepsMin,
                                            defaultRepsMax,
                                        }
                                        : {
                                            id: id,
                                            name,
                                            description,
                                            category,
                                            defaultSets: null,
                                            defaultRepsMin: null,
                                            defaultRepsMax: null,
                                        };

                                    closeModal();
                                    await updateExercise({variables: variables});
                                } catch (err) {
                                    console.error("Failed to delete:", err);

                                }
                            }}>Save Changes
                        </button>


                    </form>





                </Modal>
            )}


            {/*DELETE*/}
            {modalOpen && modalMode == 'DELETE' && (
                <Modal open={modalOpen} onClose={closeModal} title={'Delete Exercise'}>
                    <h2>
                        Are you sure you want to delete "{selectedExercise?.name}"? This will remove it from your
                        library but not from existing workouts.
                    </h2>
                    <button onClick={async () => {
                        try {
                            console.log("Deleted successfully");
                            closeModal();
                            await deleteExercise({variables: {id: selectedExercise?.id}});
                        } catch (err) {
                            console.error("Failed to delete:", err);

                        }
                    }}>Delete
                    </button>
                    <button onClick={closeModal}>Cancel</button>

                </Modal>
            )}


        </div>


    )

}

export default ExerciseList