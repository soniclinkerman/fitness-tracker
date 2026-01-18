import {TrashIcon} from "@heroicons/react/24/outline";

export default function ActiveWorkoutSessionCard({
                                                     workoutSession,
                                                     onClick,
                                                     onDiscard,
                                                 }) {
    const { startedAt } = workoutSession;
    const date = new Date(startedAt);

    const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div
            onClick={onClick}
            className="
                bg-white border border-gray-200 rounded-lg p-4 mb-6
                flex items-center justify-between
                cursor-pointer
                hover:bg-gray-50 transition
            "
        >
            {/* Left content */}
            <div>
                <h2 className="text-lg font-semibold mt-1">
                    {formatter.format(date)}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                    Active Workout Session
                </p>
            </div>

            {/* Discard button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDiscard();
                }}
                className="
        flex items-center justify-center
        w-11 h-11
        rounded-full
        border border-red-400
        text-red-400
        hover:text-red-600
        hover:border-red-300
        hover:bg-red-50
        transition
    "
                aria-label="Discard workout"
            >
                <TrashIcon className="w-6 h-6 stroke-[2]" />
            </button>
        </div>
    );
}