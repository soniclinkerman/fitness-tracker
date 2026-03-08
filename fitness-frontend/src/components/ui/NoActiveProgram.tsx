export default function NoActiveProgram({
                                            title,
                                            description,
                                            onClick,
                                            dataCy,
                                            variant = "default",
                                        }) {
    if (variant === "quick") {
        return (
            <button
                data-cy={dataCy}
                onClick={onClick}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-2xl p-6 transition shadow-sm hover:shadow-md"
            >
                <h3 className="text-xl font-semibold mb-2">
                    {title}
                </h3>
                <p className="text-teal-100 text-sm mb-4">
                    {description}
                </p>
                <span className="inline-block bg-white text-teal-700 font-semibold px-5 py-2 rounded-lg">
                    Start Now
                </span>
            </button>
        );
    }

    return (
        <button
            data-cy={dataCy}
            onClick={onClick}
            className="w-full text-left rounded-2xl p-6 border border-gray-200 bg-white hover:bg-gray-50 transition"
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
            </h3>
            <p className="text-sm text-gray-600">
                {description}
            </p>
        </button>
    );
}