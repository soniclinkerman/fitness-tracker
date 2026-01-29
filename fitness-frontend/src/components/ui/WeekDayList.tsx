export default function WeekDayList({ workoutDays: days, nextWorkoutDay, title, workoutSession, onClick }) {
    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">{title}</h2>

            <div className="space-y-3">
                {days.map((day) => {
                    // Compute states
                    const isCompleted = nextWorkoutDay && day.dayNumber < nextWorkoutDay.dayNumber;
                    const isCurrent = nextWorkoutDay && day.dayNumber === nextWorkoutDay.dayNumber && !workoutSession
                    const isFuture = nextWorkoutDay && day.dayNumber > nextWorkoutDay.dayNumber;
                    const isInProgress = workoutSession && day.id === workoutSession.workoutDaySession.workoutDayId
                    return (
                        <button
                            onClick={isInProgress ? onClick : null}
                            key={day.id}
                            disabled={isFuture}
                            data-cy={`week-day-btn-${day.dayNumber}`}
                            className={`
                                w-full flex items-center justify-between
                                rounded-xl px-4 py-4 bg-white
                                shadow-[0_1px_4px_rgba(0,0,0,0.05)]
                                border transition
                                ${isCurrent ? "border-blue-500" : "border-gray-100"}
                                ${isFuture ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}
                            `}
                        >
                            {/* LEFT */}
                            <div className="flex items-center gap-4">
                                {/* Icon Container */}
                                <div className="
                                    w-10 h-10 rounded-xl flex items-center justify-center
                                    bg-gray-100
                                ">
                                    {/* Icon based on state */}
                                    {isCompleted && (
                                        <span className="text-green-600 text-xl">✔️</span>
                                    )}

                                    {isCurrent && (
                                        <span className="text-blue-600 text-xl">⭐</span>
                                    )}

                                    {isFuture && (
                                        <span className="text-gray-400 text-xl">🏋️‍♂️</span>
                                    )}

                                    {!isCompleted && !isFuture && !isCurrent && (
                                        <span className="text-gray-700 text-xl">🏋️‍♂️</span>
                                    )}
                                </div>

                                {/* Text */}
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">
                                        {day.name}
                                    </p>

                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        {day.workoutExercises.length} exercises

                                        {isCompleted && (
                                            <span className="text-green-600 font-medium">
                                                • Completed
                                            </span>
                                        )}

                                        {isCurrent && (
                                            <span className="text-blue-600 font-medium">
                                                • Up Next
                                            </span>
                                        )}
                                        {isInProgress &&(
                                            <span className="text-yellow-600 font-medium">
                                                • In Progress
                                            </span>
                                        )}

                                    </p>
                                </div>
                            </div>

                            {/* RIGHT ARROW */}
                            {!isFuture && (
                                <span className="text-gray-400 text-lg">›</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}