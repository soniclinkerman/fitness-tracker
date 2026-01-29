import {Link, Outlet} from "react-router-dom";
import {JSX} from "react";

const MainLayout = (): JSX.Element => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-100 p-4 shadow">
                <nav className="flex gap-6">
                    <Link to={"/"} data-cy="nav-home-link">Home</Link>
                    <Link to="/exercises" data-cy="nav-exercises-link">Exercises</Link>
                    <Link to="/programs" data-cy="nav-programs-link">Programs</Link>
                    <Link to="/workout-history" data-cy="nav-progress-link">Progress</Link>
                </nav>
            </header>

            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};


export default MainLayout