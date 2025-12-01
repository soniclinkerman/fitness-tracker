export default function NextWorkoutCard({ day, onStart, active }) {
    if (!day) return null;

    return (
        <div className="mt-6">
            {/* Card */}
            <div className="
                bg-white
                rounded-3xl
                border border-teal-300
                p-5
                shadow-[0_2px_10px_rgba(0,0,0,0.04)]
                "
            >

                {/* Top section */}
                <div className="flex items-center gap-4 pb-6">
                    <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl text-teal-700">🏋️‍♂️</span>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900 text-lg">{day.name}</p>
                        {day.description && (
                            <p className="text-sm text-gray-500">{day.description}</p>
                        )}

                        <p className="text-sm text-gray-600 mt-1">
                            🏋️ {day.workoutExercises.length} exercises
                        </p>
                    </div>
                </div>

                {/* Start Button */}
                <button
                    onClick={onStart}
                    className="
                    w-full
                    bg-teal-600
                    text-white
                    py-4
                    rounded-2xl
                    font-medium
                    flex items-center justify-center gap-2
                    text-lg
                    hover:bg-teal-700
                    transition
                    "
                >
                    <span className="text-xl">▶️</span>
                    {active ? "Resume" : "Start"} Workout
                </button>

            </div>
        </div>
    );
}