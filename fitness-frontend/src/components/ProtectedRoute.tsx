import {useContext} from "react";
import {AuthContext} from "../context/AuthContext.tsx";
import {Navigate} from "react-router-dom";
const ProtectedRoute = ({children}) => {
    const context = useContext(AuthContext)

    if(!context.token)
    {
        return <Navigate to={"/login"}/>
    }
    return <>{children}</>

}

export default ProtectedRoute