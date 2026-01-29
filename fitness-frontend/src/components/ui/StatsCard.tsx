export default function StatsCard({ icon, value, label,dataCy }) {
    return (
        <div data-cy={dataCy} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
            <div className="text-xl">{icon}</div>
            <div>
                <p className="text-lg font-semibold">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
            </div>
        </div>
    );
}