import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline"; // Assuming you use Heroicons

const BackButton = ({directory=-1,handleButton}) => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(directory);  // This will navigate to the previous page
    };

    return (
        <button
            onClick={handleButton ? handleButton : handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
            <ArrowLeftIcon className="w-5 h-5" /> {/* Arrow Icon */}
            Back
        </button>
    );
};

export default BackButton;
