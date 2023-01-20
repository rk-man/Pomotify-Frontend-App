import React, { useContext, useEffect, useState } from "react";
import Layout from "@/components/Layout";

import { SPOTIFY_AUTH_URL } from "@/config/index";

import { useRouter } from "next/router";

import SpotifyContext from "contexts/spotifyContext";
import LoadingSpinner from "@/utils/LoadingSpinner";

function SpotifyConnectPage() {
    const { spotifyCode, getAccessToken, accessToken } =
        useContext(SpotifyContext);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (accessToken) {
            router.push("/spotify/home");
        }
        setLoading(false);
    }, [spotifyCode, accessToken]);

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center gap-4">
                {loading && <LoadingSpinner />}
                {!spotifyCode ? (
                    <>
                        <p>This helps you connect to the spotify app</p>
                        <button className="bg-black hover:bg-white text-white font-semibold hover:text-black py-4 px-8 border border-2 border-black rounded text-4xl">
                            <a href={SPOTIFY_AUTH_URL}>Connect To Spotify</a>
                        </button>
                    </>
                ) : (
                    <>
                        {" "}
                        <p>
                            This helps you create the access token which lets
                            you utilize the spotify features
                        </p>
                        <button
                            onClick={getAccessToken}
                            className="bg-black hover:bg-white text-white font-semibold hover:text-black py-4 px-8 border border-2 border-black rounded text-4xl"
                        >
                            Get Access Token
                        </button>
                    </>
                )}
            </div>
        </Layout>
    );
}

export default SpotifyConnectPage;
