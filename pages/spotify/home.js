import Layout from "@/components/Layout";
import SpotifyContext from "contexts/spotifyContext";
import React, { useContext, useEffect, useState } from "react";

import AuthContext from "./../../contexts/authContext";

import SpotifyNotLoggedIn from "@/components/SpotifyNotLoggedIn";

import styles from "@/styles/Spotify.module.css";
import SearchBar from "@/components/SearchBar";
import SpotifyWebApi from "spotify-web-api-node";
import EachTrack from "@/components/EachTrack";

import Link from "next/link";
import LoadingSpinner from "@/utils/LoadingSpinner";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
});

function SpotifyHomePage() {
    const { user } = useContext(AuthContext);
    const { accessToken } = useContext(SpotifyContext);
    const [searchText, setSearchText] = useState("");
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (accessToken) {
            spotifyApi.setAccessToken(accessToken);
        }
        setLoading(false);
    }, [accessToken]);

    useEffect(() => {
        if (searchText && accessToken) {
            spotifyApi
                .searchTracks(searchText)
                .then((res) => {
                   
                    setTracks(res.body.tracks.items);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setTracks([]);
        }
    }, [searchText]);

    return (
        <Layout>
            {loading && <LoadingSpinner />}
            {user && accessToken && (
                <div className="flex flex-col items-center justify-center gap-16">
                    <div className="flex items-center justify-center gap-16">
                        <Link href="/spotify/playlists">
                            <button className="bg-black hover:bg-white text-white hover:text-black py-3 px-6 parent text-2xl border-2 border-black">
                                Your Playlists
                            </button>
                        </Link>
                        <Link href="/spotify/liked-songs">
                            <button className="bg-black hover:bg-white text-white hover:text-black py-3 px-6 parent text-2xl border-2 border-black">
                                Liked Songs
                            </button>
                        </Link>
                    </div>
                    <SearchBar
                        searchText={searchText}
                        setSearchText={setSearchText}
                        styles={styles}
                    />
                    <div className={styles.AllTracks}>
                        {tracks.length > 0
                            ? tracks.map((track, index) => {
                                  return (
                                      <EachTrack key={track.id} track={track} />
                                  );
                              })
                            : !loading && <h1>No tracks</h1>}
                    </div>
                </div>
            )}

            {!accessToken && <SpotifyNotLoggedIn />}
        </Layout>
    );
}

export default SpotifyHomePage;
