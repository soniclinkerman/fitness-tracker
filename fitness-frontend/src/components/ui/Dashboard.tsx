import StatsCard from "./StatsCard.js";
import WeekDayList from "./WeekDayList.js";
import ActiveProgramCard from "./ActiveProgramCard.js";
import NoActiveProgram from "./NoActiveProgram.js";
import {useNavigate} from "react-router-dom";
import NextWorkoutCard from "./NextWorkoutCard.tsx";


export default function Dashboard({ activeProgram, totalWorkouts, currentWeek }) {
    const navigate = useNavigate()
    console.log(activeProgram)
    return (
        <div className="p-6 max-w-4xl mx-auto">

            {/* Header */}
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-gray-500 mb-6">Track your fitness journey</p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <StatsCard
                    icon="🏆"
                    value={totalWorkouts}
                    label="Total Workouts"
                />
                <StatsCard
                    icon="📅"
                    value={currentWeek}
                    label="Current Week"
                />
            </div>

            {/* Conditional */}
            {activeProgram ? (
                <>
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold mb-3">Next Workout</h2>
                        <NextWorkoutCard day={activeProgram.nextWorkoutDay}/>
                    </div>

                    <ActiveProgramCard program={activeProgram} />

                    <div>
                        <WeekDayList
                            title={"This Week"}
                            workoutDays={activeProgram.workoutDays}
                            nextWorkoutDay={activeProgram.nextWorkoutDay}
                        />
                    </div>
                </>
            ) : (
                <NoActiveProgram  onClick={() => navigate(`/programs`)}/>
            )}

            {/* Get Started */}
            {!activeProgram && (
                <div className="mt-10 space-y-3">

                    <div className="flex gap-3 items-center p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-700 text-sm">
                            1
                        </div>
                        <div>
                            <p className="font-medium text-sm">Choose a Program</p>
                            <p className="text-xs text-gray-500">
                                Browse available programs and pick one that fits your goals
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-700 text-sm">
                            2
                        </div>
                        <div>
                            <p className="font-medium text-sm">Follow the Schedule</p>
                            <p className="text-xs text-gray-500">
                                Complete workouts consistently to see progress
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-700 text-sm">
                            3
                        </div>
                        <div>
                            <p className="font-medium text-sm">Track Your Progress</p>
                            <p className="text-xs text-gray-500">
                                Monitor strength gains and celebrate achievements
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}