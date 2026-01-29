import StatsCard from "./StatsCard.js";
import WeekDayList from "./WeekDayList.js";
import ActiveProgramCard from "./ActiveProgramCard.js";
import NoActiveProgram from "./NoActiveProgram.js";
import {useNavigate} from "react-router-dom";
import NextWorkoutCard from "./NextWorkoutCard.tsx";
import {useMutation, useQuery} from "@apollo/client/react";
import {
    DELETE_WORKOUT_SESSION,
    START_QUICK_WORKOUT_SESSION,
    START_WORKOUT_SESSION
} from "../../graphql/mutations/workoutSessionMutations.ts";
import {GET_ACTIVE_WORKOUT_SESSION} from "../../graphql/queries/workoutSessionQueries.ts";
import {useEffect, useState} from "react";
import ActiveWorkoutSessionCard from "./ActiveWorkoutSessionCard.tsx";
import Modal from "./Modal.tsx";
import {GET_ACTIVE_PROGRAM, GET_PROGRAM} from "../../graphql/queries/programQueries.ts";


export default function Dashboard({ activeProgram, totalWorkouts, currentWeek }) {
    const [modalMode, setModalMode] = useState<'CREATE' | 'UPDATE' | 'DELETE' | null>(null);
    const navigate = useNavigate();
    const [workoutSession, setWorkoutSession] = useState();
    const { data, loading } = useQuery(GET_ACTIVE_WORKOUT_SESSION);

    useEffect(() => {
        if (data?.activeWorkoutSession) {
            setWorkoutSession(data.activeWorkoutSession);
        }
    }, [data]);

    const [startWorkoutSession] = useMutation(START_WORKOUT_SESSION, {
        onCompleted: (data) => {
            const id = data.startWorkoutSession.workoutSession.id;
            navigate(`/workout-sessions/${id}`);
        },
    });

    const [startQuickWorkoutSession] = useMutation(START_QUICK_WORKOUT_SESSION, {
        onCompleted: (data) => {
            const id = data.startQuickWorkoutSession.workoutSession.id;
            navigate(`/workout-sessions/${id}`);
        }
    });

    const [deleteWorkoutSession] = useMutation(DELETE_WORKOUT_SESSION, {
        onCompleted: () => {
            setModalMode(null);
        },
        refetchQueries: [
            { query: GET_ACTIVE_PROGRAM },
        ] as Parameters<typeof useMutation>[1]["refetchQueries"],
    });

    const startWorkout = async () => {
        try {
            await startWorkoutSession();
        } catch (err) {
            console.error("Failed to start workout:", err);
        }
    };

    const discardWorkoutSession = async () => {
        try {
            await deleteWorkoutSession();
        } catch (err) {
            console.error("Failed to delete workout session:", err);
        }
    };

    const resumeWorkout = () => {
        console.log(workoutSession);
        const id = workoutSession.id;
        navigate(`/workout-sessions/${id}`);
    };

    const deleteModalContent = (
        <div>
            <h2>
                Are you sure you want to discard this workout session? This can not be undone.
            </h2>
            <button onClick={discardWorkoutSession} data-cy="discard-workout-session">Delete</button>
            <button onClick={() => setModalMode(null)} data-cy="cancel-delete-workout-session">Cancel</button>
        </div>
    );

    // Handle sorting in the frontend.
    const sortedDays = activeProgram ? [...activeProgram.workoutDays].sort((a, b) => a.dayNumber - b.dayNumber) : null;

    if (loading) return <div>Loading...</div>;

    const activeProgramContent = (
        <>
            <div className="mb-5" data-cy="next-workout-card">
                <h2 className="text-lg font-semibold mb-3">Next Workout</h2>
                <NextWorkoutCard
                    day={activeProgram?.nextWorkoutDay}
                    onStart={workoutSession?.id ? resumeWorkout : startWorkout}
                    active={workoutSession}
                    dataCy={"next-workout-card-button"}
                />
            </div>

            <ActiveProgramCard program={activeProgram} data-cy="active-program-card"/>

            <div data-cy="workout-day-list">
                <WeekDayList
                    onClick={resumeWorkout}
                    title={"This Week"}
                    workoutSession={workoutSession}
                    workoutDays={sortedDays}
                    nextWorkoutDay={activeProgram?.nextWorkoutDay}
                />
            </div>
        </>
    );

    const activeWorkoutSessionContent = (
        <>
            <div className="mb-5" data-cy="active-workout-session-header">
                <h2 className="text-lg font-semibold mb-3">In Progress</h2>
            </div>

            <ActiveWorkoutSessionCard workoutSession={workoutSession} onClick={resumeWorkout} onDiscard={() => setModalMode('DELETE')} data-cy="active-workout-session-card"/>
        </>
    );

    const noActiveSessionOrProgramContent = (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <NoActiveProgram
                title="Choose a Program"
                description="Browse programs and follow a structured plan"
                onClick={() => navigate("/programs")}
                dataCy="choose-program-card"
            />

            <div className="text-center text-gray-500 font-semibold mx-2" data-cy="or-separator">OR</div>

            <NoActiveProgram
                title="Start a Workout"
                description="Jump straight into a workout without a program"
                onClick={startQuickWorkoutSession}
                variant="quick"
                dataCy="start-quick-workout-card"
            />
        </div>
    )


    return (
        <div className="p-6 max-w-4xl mx-auto">

            {/* Header */}
            <h1 className="text-xl font-semibold" data-cy="dashboard-title">Dashboard</h1>
            <p className="text-gray-500 mb-6" data-cy="dashboard-description">Track your fitness journey</p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <StatsCard
                    icon="🏆"
                    value={totalWorkouts}
                    label="Total Workouts"
                    dataCy="total-workouts-card"
                />
                <StatsCard
                    icon="📅"
                    value={currentWeek}
                    label="Current Week"
                    dataCy="current-week-card"
                />
            </div>

            {/* Conditional */}
            {activeProgram && activeProgramContent}
            {(!activeProgram && workoutSession) && activeWorkoutSessionContent}
            {(!activeProgram && !workoutSession) && noActiveSessionOrProgramContent}

            {/* Get Started */}
            {(!activeProgram && !workoutSession) && (
                <div className="mt-10 space-y-3" data-cy="get-started-section">

                    <div className="flex gap-3 items-center p-4 bg-white border border-gray-200 rounded-lg" data-cy="choose-program-step">
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

                    <div className="flex gap-3 items-center p-4 bg-white border border-gray-200 rounded-lg" data-cy="follow-schedule-step">
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

                    <div className="flex gap-3 items-center p-4 bg-white border border-gray-200 rounded-lg" data-cy="track-progress-step">
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

            {modalMode === 'DELETE' &&
                <Modal onClose={() => setModalMode(null)} title="Discard Workout Session">
                    {deleteModalContent}
                </Modal>
            }

        </div>
    );
}