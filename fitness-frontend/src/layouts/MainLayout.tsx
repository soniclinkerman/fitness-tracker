import {Link, Outlet, useLocation} from "react-router-dom";
import {JSX, useContext} from "react";
import {AuthContext} from "../context/AuthContext.tsx";
import {useQuery} from "@apollo/client/react";
import {ME} from "../graphql/queries/userQueries.ts";
import {HomeIcon, RectangleStackIcon, ChartBarIcon, ArrowRightStartOnRectangleIcon} from "@heroicons/react/24/outline";
import {HomeIcon as HomeIconSolid, RectangleStackIcon as RectangleStackIconSolid, ChartBarIcon as ChartBarIconSolid} from "@heroicons/react/24/solid";

const MainLayout = (): JSX.Element => {
    const context = useContext(AuthContext)
    const {token} = context
    const location = useLocation()

    const {data:user} = useQuery(ME)

    const navItems = [
        { to: "/", label: "Home", icon: HomeIcon, activeIcon: HomeIconSolid },
        { to: "/exercises", label: "Exercises", icon: RectangleStackIcon, activeIcon: RectangleStackIconSolid },
        { to: "/workout-history", label: "Progress", icon: ChartBarIcon, activeIcon: ChartBarIconSolid },
    ]

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top header with user info - only on desktop */}
            {token &&
            <header className="hidden md:block bg-gray-100 p-4 shadow">
                <nav className="flex justify-between items-center">
                    <div className="flex gap-6">
                        <Link to="/" data-cy="nav-home-link">Home</Link>
                        <Link to="/exercises" data-cy="nav-exercises-link">Exercises</Link>
                        <Link to="/workout-history" data-cy="nav-progress-link">Progress</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {user?.user?.name && (
                            <span className="text-gray-700 font-medium">{user.user.name}</span>
                        )}
                        <Link
                            onClick={() => context.logout()}
                            to="/login"
                            className="text-gray-500 hover:text-gray-700"
                            data-cy="nav-logout-link"
                        >
                            Log Out
                        </Link>
                    </div>
                </nav>
            </header>
            }

            {/* Main content */}
            <main className="flex-1 pb-20 md:pb-0">
                <Outlet />
            </main>

            {/* Bottom navigation - mobile only */}
            {token &&
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to
                        const Icon = isActive ? item.activeIcon : item.icon
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`flex flex-col items-center gap-1 ${isActive ? 'text-teal-600' : 'text-gray-500'}`}
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        )
                    })}
                    <button
                        onClick={() => context.logout()}
                        className="flex flex-col items-center gap-1 text-gray-500"
                        data-cy="nav-mobile-logout-btn"
                    >
                        <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
                        <span className="text-xs font-medium">Logout</span>
                    </button>
                </div>
            </nav>
            }
        </div>
    );
};

export default MainLayout