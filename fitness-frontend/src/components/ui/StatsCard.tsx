export default function StatsCard({ icon, value, label, dataCy }) {
    return (
        <div data-cy={dataCy} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    );
}