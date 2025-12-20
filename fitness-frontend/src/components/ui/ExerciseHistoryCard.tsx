interface ExerciseHistoryCardProps {
    exerciseHistory: {
        sets: {
            id: string
            completedReps: number
            completedWeight: number
        }[]
        workoutSession: {
            updatedAt: string
        }
    }
}

const ExerciseHistoryCard = ({ exerciseHistory }) => {
    const { sets, workoutSession } = exerciseHistory;

    const date = new Date(workoutSession.updatedAt);
    const dateCompleted = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const totalSets = sets.length;
    const avgReps =
        Math.round(sets.reduce((sum, s) => sum + s.completedReps, 0) / totalSets);

    const volume = sets.reduce(
        (sum, s) => sum + s.completedReps * s.completedWeight,
        0
    );

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 space-y-5">

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">{dateCompleted}</p>
                </div>

                {workoutSession.rpe && (
                    <span className="text-sm text-gray-500">
                        RPE {workoutSession.rpe}/10
                    </span>
                )}
            </div>

            {/* Set Breakdown */}
            <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600">
                    Set Breakdown
                </p>

                {sets.map((set, i) => (
                    <div
                        key={set.id}
                        className="
                            flex items-center justify-between
                            bg-gray-50 rounded-xl px-4 py-3
                        "
                    >
                        <div className="flex items-center gap-3">
                            <div className="
                                w-7 h-7 rounded-full bg-teal-100
                                flex items-center justify-center
                                text-xs font-medium text-teal-700
                            ">
                                {i + 1}
                            </div>

                            <span className="text-sm text-gray-700">
                                Set {i + 1}
                            </span>
                        </div>

                        <div className="text-sm text-gray-800 font-medium">
                            {set.completedWeight} lbs <span className="text-gray-400 mx-1">×</span> {set.completedReps} reps
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="
                grid grid-cols-1 gap-4
                bg-teal-50 rounded-xl p-4
                md:grid-cols-3
            ">
                <div>
                    <p className="text-xs text-gray-600">Total Sets</p>
                    <p className="font-semibold text-gray-900">{totalSets}</p>
                </div>

                <div>
                    <p className="text-xs text-gray-600">Avg Reps</p>
                    <p className="font-semibold text-gray-900">{avgReps}</p>
                </div>

                <div>
                    <p className="text-xs text-gray-600">Volume</p>
                    <p className="font-semibold text-gray-900">
                        {volume.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ExerciseHistoryCard