import {Outlet, Route, Routes} from "react-router-dom";
import ExerciseList from "../components/ExerciseList.tsx";
import {JSX} from "react";
import ProgramsPage from "../pages/ProgramsPage.tsx";
import MainLayout from "../layouts/MainLayout.tsx";
import ProgramDetailPage from "../pages/ProgramDetailPage.tsx";
import WorkoutDayDetailPage from "../pages/WorkoutDayDetailPage.tsx";
import DashboardPage from "../pages/DashboardPage.tsx";
import WorkoutSessionPage from "../pages/WorkoutSessionPage.tsx";
import ExerciseLoggingPage from "../pages/ExerciseLoggingPage.tsx";
import WorkoutHistory from "../pages/WorkoutHistoryPage.tsx";
import ExerciseHistoryPage from "../pages/ExerciseHistoryPage.tsx";


const AppRoutes = (): JSX.Element => {
    return(
        <Routes>
            <Route element={<MainLayout/>}>
                <Route index element={<DashboardPage/>} />
                <Route path={"/exercises"} element={<ExerciseList/>}/>
                <Route path={"programs"} element={<ProgramsPage/>}/>
                <Route path={"programs/:id"} element={<ProgramDetailPage/>}/>
                <Route path={"programs/:programId/days/:dayId"} element={<WorkoutDayDetailPage/>}/>
                <Route path={"workout-sessions/:id"} element={<WorkoutSessionPage/>}/>
                <Route path={"workout-sessions/:sessionId/exercise/:workoutExerciseId"} element={<ExerciseLoggingPage/>}/>
                <Route path={"workout-history"} element={<WorkoutHistory/>}/>
                <Route path={"workout-history/:exerciseId"} element={<ExerciseHistoryPage/>} />
            </Route>
        </Routes>
    )
}

export default AppRoutes