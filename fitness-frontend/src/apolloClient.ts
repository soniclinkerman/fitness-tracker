import {
    ApolloClient,
    ApolloLink,
    CombinedGraphQLErrors,
    CombinedProtocolErrors,
    HttpLink,
    InMemoryCache
} from "@apollo/client";
import { SetContextLink} from "@apollo/client/link/context";
import {ErrorLink} from "@apollo/client/link/error";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const errorLink = new ErrorLink(({ error, operation }) => {
    if (CombinedGraphQLErrors.is(error)) {
        error.errors.forEach(({ message, locations, path }) =>
        {
            if(message.includes("User does not exist"))
            {
                localStorage.removeItem('token')
                window.location.href = "/login"
            }
        }

        );
    } else if (CombinedProtocolErrors.is(error)) {
        // Protocol errors handled silently
    } else {
        // Network errors handled silently
    }
});

const authLink = new SetContextLink((prevContext, operation) => {
    const token = localStorage.getItem("token")

    return {
        headers: {
            ...prevContext.headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});


const httpLink = new HttpLink({ uri: `${API_URL}/graphql` })

const link = ApolloLink.from([authLink,errorLink, httpLink]);

const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
});

export default client