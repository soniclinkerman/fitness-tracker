import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import client from "./apolloClient";
import {ApolloProvider} from "@apollo/client/react";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </ApolloProvider>
    </React.StrictMode>

);
