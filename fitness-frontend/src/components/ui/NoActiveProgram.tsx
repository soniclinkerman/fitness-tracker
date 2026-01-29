export default function NoActiveProgram({
                                            title,
                                            description,
                                            onClick,
                                            dataCy,
                                            variant = "default",
                                        }) {
    return (
        <button
            data-cy={dataCy}
            onClick={onClick}
            className={`
                w-full text-left
                rounded-2xl p-6
                border
                transition
                ${
                variant === "quick"
                    ? "border-teal-300 bg-teal-50 hover:bg-teal-100"
                    : "border-gray-200 bg-white hover:bg-gray-50"
            }
            `}
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
            </h3>

            <p className="text-sm text-gray-600">
                {description}
            </p>

            {variant === "quick" && (
                <p className="mt-3 text-sm font-medium text-teal-700">
                    Start now →
                </p>
            )}
        </button>
    );
}