import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/24/solid";
import type {CATEGORY} from "../types/ExerciseCategoryEnum.ts";

interface WorkoutSet {
    id: string;
    plannedWeight: number;
    targetRepsMin: number;
    targetRepsMax: number;
    withinTargetRange: boolean;
}

interface WorkoutExerciseCardProps {
    key: string
    category: CATEGORY,
    exerciseName: string;
    workoutSets: WorkoutSet[];
    onEdit:() => void;
    onDelete: () => void
}

const WorkoutExerciseCard = ({ exerciseName, workoutSets,category,onEdit,onDelete }: WorkoutExerciseCardProps) => {
    // Derived values
    const totalSets = workoutSets.length;
    const minReps = workoutSets[0]?.targetRepsMin;
    const maxReps = workoutSets[0]?.targetRepsMax;
    const startingWeight = workoutSets[0]?.plannedWeight ?? 0;
    const lastWeight = workoutSets[workoutSets.length - 1]?.plannedWeight ?? 0;
    const increment = lastWeight - startingWeight;
    const progress = Math.round(
        (workoutSets.filter((s) => s.withinTargetRange).length / totalSets) * 100
    );

    const handleMinMaxOutputLogic = (set) => {
        if(set.targetRepsMin !== null && set.targetRepsMax !== 0)
        {
            return `${set.targetRepsMin} - ${set.targetRepsMax}`
        }
        else{
           return `≥ ${set.targetRepsMin}`
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold text-gray-900">{exerciseName}</h3>
                {category}
            </div>

            {/* Sets & Reps */}
            <p className="text-sm text-gray-500">
                {totalSets} sets
            </p>

            {/* Gray Stats Box */}
            {
                workoutSets.map((set,i) => (
                    <div className="bg-gray-50 rounded-xl p-4 mt-4 flex justify-between text-sm text-gray-700">
                        <div>
                            <p className="text-gray-500 text-xs">Set {i+1}</p>
                            <p className="font-medium">{set.plannedWeight} lbs</p>
                        </div>
                        {/*<div>*/}
                        {/*    <p className="text-gray-500 text-xs">Weight</p>*/}
                        {/*    <p className="font-medium">*/}
                        {/*        {set.plannedWeight} lbs*/}
                        {/*    </p>*/}
                        {/*</div>*/}
                        <div>
                            <p className="text-gray-500 text-xs">Reps</p>
                            <p className="font-medium text-green-600">
                                {handleMinMaxOutputLogic(set)}
                            </p>
                        </div>
                    </div>

                ))
            }

            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>


        </div>
    );
};

export default WorkoutExerciseCard;
