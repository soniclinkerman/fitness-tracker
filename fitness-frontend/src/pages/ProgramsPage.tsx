import {useMutation, useQuery} from "@apollo/client/react";
import {GET_ALL_PROGRAMS, GET_PROGRAM} from "../graphql/queries/programQueries.ts";
import ProgramCard from "../components/ProgramCard.tsx";
import {useState} from "react";
import type {Exercise} from "../types/Exercise.ts";
import type {Program} from "../types/Program.ts";
import type {ModalMode} from "../types/ModalMode.ts";
import Modal from "../components/ui/Modal.tsx";
import {CATEGORY} from "../types/ExerciseCategoryEnum.ts";
import {CREATE_PROGRAM, DELETE_PROGRAM, UPDATE_PROGRAM} from "../graphql/mutations/programMutations.ts";
import {useNavigate} from "react-router-dom";
import BackButton from "../components/BackButton.tsx";
import {GET_WORKOUT_DAY} from "../graphql/queries/workoutDayQueries.ts";

const ProgramsPage = () => {
    let navigate = useNavigate()

    const {data, loading,error} = useQuery(GET_ALL_PROGRAMS);
    const [createProgram] = useMutation(CREATE_PROGRAM, {
        onCompleted: (data) => {
            const id = data.createProgram.program.id;
            closeModal();
            navigate(`/programs/${id}`);
        },
    })

    const [updateProgram] = useMutation(UPDATE_PROGRAM, {
        refetchQueries: [
            { query: GET_PROGRAM },
        ] as Parameters<typeof useMutation>[1]["refetchQueries"],
        onCompleted: () => {
            closeModal()
        }
    })

    const [name,setName] = useState('')
    const [description,setDescription] = useState('')
    const [daysInProgram,setDaysInProgram] = useState<Number>()

    const [modalMode,setModalMode] = useState<ModalMode>('CLOSED')
    const [selectedProgramId,setSelectedProgramId] = useState<Program | null>(null)



    const [deleteProgram] = useMutation(DELETE_PROGRAM,
        {
            refetchQueries: [
                { query: GET_PROGRAM },
            ] as Parameters<typeof useMutation>[1]["refetchQueries"],
            onCompleted: () => {
                closeModal();
            },
            onError: (err) => {
                alert("Something went wrong: " + err.message);
            }
        });

    const closeModal = () => {
        setModalMode('CLOSED')
        setName('')
        setDescription('')
        setDaysInProgram(undefined)
    }

    const onDelete = (id) => {
        setSelectedProgramId(id)
        console.log(id)
        setModalMode('DELETE')
    }
    const onEdit = async (id) => {
        await updateProgram({variables: {id:id, description:description, name:name}})
    }

    const editModal = (id) => {
        const selectedProgram = data.programs.find(program => program?.id === id)
        setName(selectedProgram.name)
        setDescription(selectedProgram.description)
        setSelectedProgramId(id)
        setModalMode('UPDATE')
    }

    const openCreate = () => {
        setModalMode('CREATE')
    }

    if(loading) return <div>Loading...</div>

    return(
        <div>
            <button
                onClick={() => openCreate()}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
                + New Program
            </button>

            {data.programs.map(program => {
                return(
                    <ProgramCard onEdit={()=> editModal(program?.id)} onDelete={()=> onDelete(program?.id)} program={program}/>
                )
            })}

            {modalMode === 'CREATE' && (

                    <Modal onClose={closeModal} title={'Create New Program'}>
                        {/*FORM*/}
                        <form className="max-w-sm mx-auto">
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Program Name</label>
                                <input type="text"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                       placeholder="e.g., Incline Bench Press" required onChange={(e) => setName(e.target.value)}/>
                            </div>
                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Description (Optional)</label>
                                <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" placeholder={'Add notes about form, texhnique, or variations...'} onChange={(e) => setDescription(e.target.value)}>

                            </textarea>
                            </div>

                            <div className="mb-5">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Days In Program</label>
                                <input type="number"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                       onChange={(e) => setDaysInProgram(Number(e.target.value))}/>
                            </div>

                            <button
                                className={"bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"}

                                onClick={closeModal}
                            >Cancel</button>
                            <button
                                disabled={loading}
                                className={"text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"}
                                onClick={async (e) => {
                                    e.preventDefault()
                                    try {
                                        const variables = {name,description, daysPerWeek:daysInProgram}
                                        await createProgram({ variables });
                                    } catch (err) {
                                        console.error("Failed to create program:", err);

                                    }
                                }}
                            >Continue
                            </button>


                        </form>





                    </Modal>
            )}

            {modalMode === 'UPDATE' && (

                <Modal onClose={closeModal} title={'Update Program'}>
                    {/*FORM*/}
                    <form className="max-w-sm mx-auto">
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Program Name</label>
                            <input value={name} type="text"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
                                   placeholder="e.g., Incline Bench Press" required onChange={(e) => setName(e.target.value)}/>

                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Description (Optional)</label>
                            <textarea value={description} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5" placeholder={'Add notes about form, texhnique, or variations...'} onChange={(e) => setDescription(e.target.value)}>

                            </textarea>
                        </div>
                        <button
                            className={"bg-gray-100 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"}

                            onClick={closeModal}
                        >Cancel</button>
                        <button
                            type={"button"}
                            disabled={loading}
                            className={"text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"}
                            onClick={()=> onEdit(selectedProgramId)}
                        >Save Changes
                        </button>


                    </form>





                </Modal>
            )}

            {
                modalMode === 'DELETE' && (
                    <Modal onClose={closeModal} title={'Delete Exercise'}>
                        <h2>
                            Are you sure you want to delete this program? This will remove all the days and exercises from it.
                        </h2>
                        <button onClick={async () => {
                            try {
                                closeModal();
                                await deleteProgram({variables: {id: selectedProgramId}});
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

export  default ProgramsPage