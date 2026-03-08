import {useQuery} from "@apollo/client/react";
import {useNavigate} from "react-router-dom";
import {GET_COMPLETED_WORKOUT_SESSIONS} from "../graphql/queries/workoutSessionQueries.ts";

export default function WorkoutHistory(){
    const {data, loading, error} = useQuery(GET_COMPLETED_WORKOUT_SESSIONS)
    const navigate = useNavigate()

    const handleWorkoutHistoryExercise = (workoutSessionId: string) => {
        navigate(`/workout-history/${workoutSessionId}`)
    }

    if(loading) return (
        <div className="p-6 max-w-4xl mx-auto">
            <p className="text-gray-500">Loading...</p>
        </div>
    )

    const {completedWorkoutSessions} = data!

    const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return(
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-xl font-semibold">Workout History</h1>
            <p className="text-gray-500 mb-6">View your completed workouts</p>

            <div className="space-y-3">
                {completedWorkoutSessions.map(session => {
                    const {id, workoutDaySession, completedAt} = session
                    const date = new Date(completedAt)
                    const exerciseCount = workoutDaySession.groupedWorkoutExercises.length
                    const weekdayName = date.toLocaleDateString('en-US', { weekday: 'long' } as const);

                    return (
                        <div
                            key={id}
                            onClick={() => handleWorkoutHistoryExercise(id)}
                            className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"
                        >
                            <p className="font-medium text-gray-900">{weekdayName}, {formatter.format(date)}</p>
                            <p className="text-sm text-gray-500">{exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}</p>
                        </div>
                    )
                })}

                {completedWorkoutSessions.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        <p>No completed workouts yet.</p>
                        <p className="text-sm mt-1">Complete a workout to see it here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
