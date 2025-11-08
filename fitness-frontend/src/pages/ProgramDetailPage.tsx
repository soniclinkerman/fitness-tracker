import WorkoutDayCard from "../components/WorkoutDayCard";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_PROGRAM } from "../graphql/queries/programQueries.ts";
import BackButton from "../components/BackButton.tsx";

const ProgramDetailPage = () => {
    const { id } = useParams();
    const { data, loading, error } = useQuery(GET_PROGRAM, { variables: { id } });

    if (loading) return <p className="p-6 text-gray-500">Loading...</p>;
    if (error) return <p className="p-6 text-red-500">Error loading program.</p>;

    const program = data?.programs[0];
    if (!program) return <p className="p-6 text-gray-500">Program not found.</p>;

    const { name, description, workoutDays } = program;


    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BackButton/>
            {/* Program header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
                {description && (
                    <p className="text-gray-600 mt-1">{description}</p>
                )}
            </div>

            {/* Section header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Workout Days</h2>
                <span className="text-sm text-gray-500">
          {workoutDays.filter((d) => d.completed).length} / {workoutDays.length} completed
        </span>
            </div>


            {/* Card grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {workoutDays.map((day) => (
                    <WorkoutDayCard key={day.id} programId={id!} day={day} />
                ))}
            </div>
        </div>
    );
};

export default ProgramDetailPage;
