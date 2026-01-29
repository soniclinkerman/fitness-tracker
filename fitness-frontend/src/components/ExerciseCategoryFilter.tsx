import React from "react";
import { CATEGORY_COLORS } from "../constants/categoryColors";

interface ExerciseCategoryFilterProps {
    selectedCategory: string | null;
    onSelect: (category: string | null) => void;
}

const ExerciseCategoryFilter = ({
                                    selectedCategory,
                                    onSelect,
                                }: ExerciseCategoryFilterProps) => {
    const categories = Object.keys(CATEGORY_COLORS);

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {/* "All" option */}
            <button
                onClick={() => onSelect(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                    selectedCategory === null
                        ? "bg-gray-800 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
                data-cy="category-filter-all-btn"
            >
                All
            </button>

            {/* Dynamic category buttons */}
            {categories.map((cat) => {
                const color = CATEGORY_COLORS[cat];
                const isActive = selectedCategory === cat;

                return (
                    <button
                        key={cat}
                        onClick={() => onSelect(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                            isActive
                                ? `${color.bg} ${color.text} border-transparent`
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                        data-cy={`category-filter-${cat.toLowerCase()}-btn`}
                    >
                        {cat}
                    </button>
                );
            })}
        </div>
    );
};

export default ExerciseCategoryFilter;
