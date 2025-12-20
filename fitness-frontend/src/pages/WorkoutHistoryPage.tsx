import {useQuery} from "@apollo/client/react";
import {GET_EXERCISES} from "../graphql/queries/exerciseQueries.ts";
import ExerciseCard from "../components/ExerciseCard.tsx";
import {useState} from "react";
import ExerciseCategoryFilter from "../components/ExerciseCategoryFilter.tsx";
import {useNavigate, useParams} from "react-router-dom";

export default function WorkoutHistory(){
    const {data,loading,error} = useQuery(GET_EXERCISES)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    let navigate = useNavigate()
    const  handleWorkoutHistoryExercise = (exercise) => {
        navigate(`/workout-history/${exercise.id}`)
    }
    if(loading) return "Loading..."

    const {exercises} = data!
    const filteredExercises = selectedCategory ? exercises.filter(exercise => exercise.category === selectedCategory) : exercises
    return(
        <div>
            <ExerciseCategoryFilter selectedCategory={selectedCategory} onSelect={(cat) => setSelectedCategory(cat)}/>

            {filteredExercises.map((ex) => (
                <ExerciseCard key={ex.id} exercise={ex} onClick={handleWorkoutHistoryExercise }/>
            ))}
        </div>
    )
}