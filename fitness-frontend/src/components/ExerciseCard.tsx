import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BoltIcon as DumbbellIcon } from "@heroicons/react/24/solid";
import type { Exercise } from "../types/Exercise";
import React, {useState} from "react";
import {CATEGORY_COLORS} from "../constants/categoryColors.ts";
import ExerciseCategoryFilter from "./ExerciseCategoryFilter.tsx";
import exerciseCategoryFilter from "./ExerciseCategoryFilter.tsx";


interface ExerciseCardProps {
    exercise: Exercise;
    onEdit?: (exercise: Exercise) => void;
    onDelete?: (exercise: Exercise) => void;
    onClick?: React.MouseEventHandler<HTMLElement>;
    modalOpen?: boolean;
    modalMode?: string;
}

const ExerciseCard = ({ exercise, onClick, onEdit, onDelete }: ExerciseCardProps) => {
    const { name, description, category, defaultSets, defaultRepsMin, defaultRepsMax } = exercise;

    const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.UNCATEGORIZED
    return (
        <div
            onClick={() => onClick?.(exercise)}
            className="w-full bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4"
            data-cy="exercise-card">
            {/* Icon */}
            <div className="p-3 bg-gray-50 rounded-xl text-gray-600 shrink-0">
                <DumbbellIcon className="w-5 h-5" /> {/* or any Heroicon placeholder */}
            </div>

            {/* Main content */}
            <div className="flex-1">
                {/* Top row: name + category */}
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-900">{name}</h3>
                    <span className={`${color.bg} ${color.text} text-xs font-semibold px-2 py-1 rounded-md uppercase`}>
        {category}
      </span>
                </div>

                {/* Description + sets/reps */}
                <p className="text-sm text-gray-500 mt-1">{description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    {defaultSets && <span>{defaultSets} sets</span>}
                    {defaultRepsMin && (
                        <>
                            <span>•</span>
                            <span>{defaultRepsMin} {defaultRepsMax && `– ${defaultRepsMax}`} reps</span>
                        </>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                    {onEdit &&
                    <button
                        onClick={() => onEdit?.(exercise)}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-200"
                        data-cy="exercise-edit-btn">
                        Edit
                    </button>
                    }
                    {onDelete &&
                    <button
                        onClick={() => onDelete?.(exercise)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-200"
                        data-cy="exercise-delete-btn">
                        Delete
                    </button>
                    }
                </div>
            </div>
        </div>


    );
};

export default ExerciseCard;
