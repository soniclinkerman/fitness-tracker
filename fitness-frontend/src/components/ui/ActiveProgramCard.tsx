export default function ActiveProgramCard({ program }) {

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Active Program</p>
            <h2 className="text-lg font-semibold mt-1">{program.name}</h2>

            <p className="text-sm text-gray-600 mt-2">
                {program.description || "No description provided."}
            </p>
        </div>
    );
}