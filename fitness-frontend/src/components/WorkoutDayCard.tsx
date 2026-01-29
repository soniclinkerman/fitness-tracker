import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface WorkoutDayCardProps {
    programId: string;
    key:number;
    day: {
        id: string;
        name: string;
        description?: string;
        completed: boolean;
        workoutExercises: { id: string; exercise: { name: string } }[];
    };
}

const WorkoutDayCard = ({ programId, day }: WorkoutDayCardProps) => {
    const {id,name,description,dayNumber, workoutExercises,completed} = day
    const exerciseCount = workoutExercises.length;

    return (
        <Link
            to={`/programs/${programId}/days/${id}`}
            className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-5"
            data-cy="workout-day-card"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">Day {dayNumber} - {name}</h3>
                    {completed && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                </div>
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            </div>

            {/* Description */}
            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}

            {/* Exercise Count */}
            <p className="text-sm text-gray-600 mt-1">{exerciseCount} exercises</p>

            {/* Exercise Chips */}
            <div className="flex flex-wrap gap-2 mt-2">
                {workoutExercises.map((we) => (
                    <span
                        key={we.id}
                        className="bg-gray-100 text-gray-700 text-sm font-medium rounded-full px-3 py-1"
                    >
            {we.exercise.name}
          </span>
                ))}
            </div>

            {/* Completion footer */}
            {completed && (
                <p className="text-green-600 text-sm mt-4 font-medium">
                    Workout completed
                </p>
            )}
        </Link>
    );
};

export default WorkoutDayCard;
