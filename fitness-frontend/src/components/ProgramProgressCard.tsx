import {Link} from "react-router-dom";

interface ProgramProgressCardProps {
    program: {
        id: string
        name: string
        description?: string
        workoutDays: { id: string; name: string; completed: boolean }[]
    }
}

const ProgramProgressCard = ({ program }: ProgramProgressCardProps) => {
    const totalDays = program.workoutDays.length
    const completedDays = program.workoutDays.filter(d => d.completed).length
    const progress = totalDays ? Math.round((completedDays / totalDays) * 100) : 0

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">{program.name}</h2>
                    <p className="text-sm text-gray-500">{program.description}</p>
                </div>
                <span className="text-gray-400 text-xl">›</span>
            </div>

            <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Day {completedDays} of {totalDays}</span>
                    <span className="text-green-600 font-medium">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-2 bg-black rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-5 border-t border-gray-100 pt-4">
                {program.workoutDays.map(day => (
                    <Link
                        key={day.id}
                        to={`/programs/${program.id}/days/${day.id}`}
                        className="bg-gray-100 text-gray-700 text-sm font-medium rounded-full px-3 py-1 hover:bg-gray-200"
                    >
                        {day.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ProgramProgressCard