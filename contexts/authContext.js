import { createContext, useEffect, useState } from "react";

import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [userLoading, setUserLoading] = useState(null);
    const [spotifyConnected, setSpotifyConnected] = useState(false);

    //hooks
    // const router = useRouter();

    //Side effects
    useEffect(() => {
        checkUserLoggedIn();
    }, []);
    //
    //     useEffect(() => {
    //         if (!user) {
    //             router.push("/login");
    //         }
    //     }, [user]);

    //reset all state variables except user
    function reset() {
        setSuccess(false);
        setError(null);
    }

    //login function
    async function login(userData) {
        try {
            setUserLoading(true);
            const res = await axios.post(`/api/login`, userData);
            setSuccess(true);
            setUser(res.data.user);
        } catch (err) {
            console.log(err);

            setError({
                err: err.response.data,
                message: err.response.data.message,
            });
        }
    }

    async function signup(userData) {
        try {
            const res = await axios.post(`/api/signup`, userData);

            setSuccess(true);
            setUser(res.data.user);
        } catch (err) {
            console.log(err);

            setError({
                err: err.response.data,
                message: err.response.data.message,
            });
        }
      
    }

    //logout
    async function logout() {
        try {
            const res = await axios.post(`/api/logout`);
            setSuccess(true);
            setUser(null);
        } catch (err) {
            console.log(err);
        }
    }

    async function checkUserLoggedIn() {
        try {
            const res = await axios.get(`/api/currentUser`);
            setUser(res.data.data);
        } catch (err) {
            // router.push("/login");
            // router.push("/404");
            console.log(err);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                success,
                error,
                reset,
                login,
                signup,
                logout,
                userLoading,
                setUserLoading,
                setUser,
                spotifyConnected,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
