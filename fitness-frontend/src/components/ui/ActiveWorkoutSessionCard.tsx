export default function ActiveWorkoutSessionCard({ workoutSession, onClick }) {

    const {startedAt} = workoutSession
    const date = new Date(startedAt);
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6" onClick={onClick}>
            <h2 className="text-lg font-semibold mt-1"> {formatter.format(date)}</h2>

            <p className="text-sm text-gray-600 mt-2">
                Active Workout Session
            </p>
        </div>
    );
}