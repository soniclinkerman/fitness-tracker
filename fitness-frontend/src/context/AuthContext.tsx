import {createContext, useEffect, useState} from 'react';
import client from "../apolloClient.ts";
export const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [token,setToken] = useState(localStorage.getItem("token"))

    const logout = () => {
        setToken(null)
        client.clearStore()
        localStorage.removeItem("token")
    }

    const login = (token) => {
        setToken(token)
        localStorage.setItem("token",token)
    }

    return(
        <AuthContext.Provider value={{ token, login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}