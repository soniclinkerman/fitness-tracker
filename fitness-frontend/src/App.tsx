import AppRoutes from "./routes/AppRoutes.tsx";
import {Toaster} from "react-hot-toast";



export default function App() {
    return (
        <div>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <AppRoutes />
        </div>
    );
}
