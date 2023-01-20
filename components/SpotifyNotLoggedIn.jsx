import SpotifyContext from "contexts/spotifyContext";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { FaBan } from "react-icons/fa";

function SpotifyNotLoggedIn() {
    const { handleReconnectSpotify } = useContext(SpotifyContext);

    return (
        <div className="text-center text-white bg-black p-16 flex flex-col items-center justify-center gap-6">
            <FaBan
                style={{
                    height: "4rem",
                    width: "4rem",
                    margin: "0 auto",
                    marginBottom: "1rem",
                }}
            />
            <div>
                <h2 className="mb-2">You are connected to Spotify</h2>
                <h3 className="">
                    Please reconnect to access your Spotify DashBoard
                </h3>
            </div>
            <button
                onClick={handleReconnectSpotify}
                className="bg-white hover:bg-black text-black font-semibold hover:text-white py-4 px-8 border border-2 border-white rounded text-3xl"
            >
                Reconnect to Spotify
            </button>
        </div>
    );
}

export default SpotifyNotLoggedIn;
