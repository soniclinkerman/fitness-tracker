import {useQuery} from "@apollo/client/react";
import {GET_ACTIVE_PROGRAM} from "../graphql/queries/programQueries.ts";
import {Link} from "react-router-dom";
import Dashboard from "../components/ui/Dashboard.tsx";

function DashboardPage() {
    const {data, loading,error} = useQuery(GET_ACTIVE_PROGRAM, {
        fetchPolicy: "network-only"
    })
    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
    if (error) return <p className="p-6 text-red-500">Error loading program.</p>;
    return(
        <div>
            <Dashboard activeProgram={data.activeProgram} totalWorkouts={'Dummy'} currentWeek={'Data'} />
        </div>


    )

}

export default DashboardPage