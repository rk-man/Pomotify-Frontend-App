import "@/styles/globals.css";

import { AuthProvider } from "contexts/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { PomoProvider } from "contexts/pomoContext";
import { SpotifyProvider } from "contexts/spotifyContext";

function MyApp({ Component, pageProps }) {
    return (
        <SpotifyProvider>
            <AuthProvider>
                <PomoProvider>
                    <Component {...pageProps} />
                    <ToastContainer
                        position="top-center"
                        autoClose={3000}
                        pauseOnHover={false}
                    />
                </PomoProvider>
            </AuthProvider>
        </SpotifyProvider>
    );
}

export default MyApp;
