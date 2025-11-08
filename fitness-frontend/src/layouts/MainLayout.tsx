import {Link, Outlet} from "react-router-dom";
import {JSX} from "react";

const MainLayout = (): JSX.Element => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gray-100 p-4 shadow">
                <nav className="flex gap-6">
                    <Link to="/">Exercises</Link>
                    <Link to="/programs">Programs</Link>
                </nav>
            </header>

            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};


export default MainLayout