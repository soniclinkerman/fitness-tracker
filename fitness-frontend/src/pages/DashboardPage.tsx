import {useQuery} from "@apollo/client/react";
import {GET_ACTIVE_PROGRAM} from "../graphql/queries/programQueries.ts";
import {Link} from "react-router-dom";
import Dashboard from "../components/ui/Dashboard.tsx";
import {GET_COMPLETED_WORKOUT_SESSIONS, WORKOUTS_THIS_WEEK} from "../graphql/queries/workoutSessionQueries.ts";

function DashboardPage() {
    const {data, loading,error} = useQuery(GET_ACTIVE_PROGRAM, {
        fetchPolicy: "network-only"
    })

    const {data:completedSessionsData, loading:completedSessionsLoading} = useQuery(GET_COMPLETED_WORKOUT_SESSIONS)
    const {data:workoutsThisWeekData, loading:workoutsThisWeekLoading} = useQuery(WORKOUTS_THIS_WEEK)



    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
    if (error) return <p className="p-6 text-red-500">Error loading program.</p>;

    return(
        <div>
            <Dashboard
                activeProgram={data.activeProgram}
                totalWorkouts={completedSessionsData ? completedSessionsData.completedWorkoutSessions.length: 0}
                workoutsThisWeek={workoutsThisWeekData? workoutsThisWeekData.workoutsThisWeek : 0} />
        </div>


    )

}

export default DashboardPage