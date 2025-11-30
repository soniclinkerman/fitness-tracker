export default function NoActiveProgram({ onClick }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center mb-8">
            <p className="text-gray-700 font-medium mb-2">
                You have no active program
            </p>
            <p className="text-gray-500 text-sm mb-6">
                Select a program to start your fitness journey.
            </p>

            <button
                onClick={onClick}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
            >
                Choose Program
            </button>
        </div>
    );
}