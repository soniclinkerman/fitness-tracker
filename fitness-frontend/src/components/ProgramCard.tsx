import type {Program} from "../types/Program.ts";
import {Link} from "react-router-dom";
import Modal from "./ui/Modal.tsx";
import type {CardActionProps} from "../types/CardActionProps.ts";

interface ProgramCardProps extends CardActionProps<Program> {
    program: Program;
}
const ProgramCard = ({ program,onEdit,onDelete }: ProgramCardProps): JSX.Element => {
    const { id, name, description, workoutDays } = program;
    const daysInProgram = workoutDays.length;



    return (
        <div className="w-full bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4">
            {/* Icon placeholder */}

            <div className="p-3 bg-gray-50 rounded-xl text-gray-600 shrink-0">
                📅
            </div>


            {/* Main Content */}
            <div className="flex-1">
                <Link to={`/programs/${id}`}>
                    <div>
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-900">{name}</h3>
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md">
            {daysInProgram} Day{daysInProgram !== 1 && "s"}
          </span>
                </div>

                {description && (
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                )}
            </div>
                </Link>

                {/* Placeholder for future Edit/Delete buttons */}
                <div className="flex gap-2 mt-3">
                    <button onClick={onEdit} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-200">
                        Quick Edit
                    </button>
                    <button onClick={onDelete} className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-200">
                        Delete
                    </button>
                </div>
            </div>



        </div>
    );
};



export default ProgramCard