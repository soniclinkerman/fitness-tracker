import {useContext, useState} from "react";
import {useMutation} from "@apollo/client/react";
import {SIGN_IN} from "../graphql/mutations/authMutations.ts";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.tsx";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const context= useContext(AuthContext)
    const navigate = useNavigate()

    const [signIn] = useMutation(SIGN_IN, {
        onCompleted: (data) => {
            toast.success("Login Successful")
            context.login(data.signIn.token)
            navigate(`/`);
        }
    })

    if(context.token)
    {
       return  <Navigate to={"/"}/>
    }

    return(
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md flex flex-col items-center px-6">
                {/* Logo */}
                <div className="w-16 h-16 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h4m12 0h-4m-8 0V4m0 2v2m8-2V4m0 2v2M4 12h16M4 18h4m12 0h-4m-8 0v-2m0 2v2m8-2v-2m0 2v2" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-500 mb-8">Sign in to continue your fitness journey</p>

                <div className="w-full space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <button
                        onClick={async (e)=> {
                            e.preventDefault()
                            try {
                                const variables = {email,password}
                                await signIn({variables})
                            } catch (err) {
                                toast.error("Invalid Credentials")
                                console.error("Invalid Login Info:", err);
                            }
                        }}
                        className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
                    >
                        Sign In
                    </button>
                </div>

                <p className="mt-6 text-gray-500">
                    Don't have an account? <Link to="/signup" className="text-teal-600 font-medium">Sign Up</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage