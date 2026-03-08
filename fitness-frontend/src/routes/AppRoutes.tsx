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
import LoginPage from "../pages/LoginPage.tsx";
import SignupPage from "../pages/SignupPage.tsx";
import ProtectedRoute from "../components/ProtectedRoute.tsx";


const AppRoutes = (): JSX.Element => {
    return(
        <Routes>
            <Route element={<MainLayout/>}>

                <Route path={"/login"} element={<LoginPage/>}/>
                <Route path={"/signup"} element={<SignupPage/>}/>

                <Route element={<ProtectedRoute><Outlet/></ProtectedRoute>}>
                    <Route index element={<DashboardPage/>} />
                    <Route path={"/exercises"} element={<ExerciseList/>}/>
                    {/*<Route path={"programs"} element={<ProgramsPage/>}/>*/}
                    {/*<Route path={"programs/:id"} element={<ProgramDetailPage/>}/>*/}
                    {/*<Route path={"programs/:programId/days/:dayId"} element={<WorkoutDayDetailPage/>}/>*/}
                    <Route path={"workout-sessions/:id"} element={<WorkoutSessionPage/>}/>
                    <Route path={"workout-sessions/:sessionId/exercise/:workoutExerciseId"} element={<ExerciseLoggingPage/>}/>
                    <Route path={"workout-history"} element={<WorkoutHistory/>}/>
                    <Route path={"workout-history/:workoutSessionId"} element={<ExerciseHistoryPage/>} />
                </Route>

            </Route>
        </Routes>
    )
}

export default AppRoutes