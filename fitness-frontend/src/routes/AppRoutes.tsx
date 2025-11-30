import {Outlet, Route, Routes} from "react-router-dom";
import ExerciseList from "../components/ExerciseList.tsx";
import {JSX} from "react";
import ProgramsPage from "../pages/ProgramsPage.tsx";
import MainLayout from "../layouts/MainLayout.tsx";
import ProgramDetailPage from "../pages/ProgramDetailPage.tsx";
import WorkoutDayDetailPage from "../pages/WorkoutDayDetailPage.tsx";
import DashboardPage from "../pages/DashboardPage.tsx";


const AppRoutes = (): JSX.Element => {
    return(
        <Routes>
            <Route element={<MainLayout/>}>
                <Route index element={<DashboardPage/>} />
                <Route path={"/exercises"} element={<ExerciseList/>}/>
                <Route path={"programs"} element={<ProgramsPage/>}/>
                <Route path={"programs/:id"} element={<ProgramDetailPage/>}/>
                <Route path={"programs/:programId/days/:dayId"} element={<WorkoutDayDetailPage/>}/>

            </Route>
        </Routes>
    )
}

export default AppRoutes