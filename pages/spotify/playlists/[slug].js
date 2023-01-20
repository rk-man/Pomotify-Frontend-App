import React, { useContext, useEffect, useState } from "react";
import Layout from "@/components/Layout";

import SpotifyWebApi from "spotify-web-api-node";
import AuthContext from "contexts/authContext";
import SpotifyContext from "contexts/spotifyContext";
import { useRouter } from "next/router";
import SpotifyNotLoggedIn from "@/components/SpotifyNotLoggedIn";
import Link from "next/link";
import styles from "@/styles/Spotify.module.css";
import EachTrack from "@/components/EachTrack";
import LoadingSpinner from "@/utils/LoadingSpinner";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
});

function SinglePlaylistPage() {
    const { user } = useContext(AuthContext);
    const { accessToken, setSelectedSongs, handlePlayAllSongs } =
        useContext(SpotifyContext);
    const [settingAccessToken, setSettingAccessToken] = useState(false);
    const [tracks, setTracks] = useState([]);
    const [playlistName, setPlaylistName] = useState("");
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (accessToken) {
            spotifyApi.setAccessToken(accessToken);
            setSettingAccessToken(true);
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken && settingAccessToken && router.query.slug) {
            spotifyApi
                .getPlaylist(router.query.slug)
                .then((data) => {
                    // setTracks(data.body.items);
                    setTracks(data.body.tracks.items);
                    setPlaylistName(data.body.name);
                    setLoading(false);
                })
                .then((err) => {
                    console.log(err);
                });
        }
    }, [router.query.slug, accessToken, settingAccessToken]);

    return (
        <Layout>
            {loading && <LoadingSpinner />}
            {user && accessToken ? (
                <div className="flex flex-col items-center justify-center gap-8 mb-16">
                    <div className="flex items-center justify-center gap-16">
                        <Link href="/spotify/home">
                            <button className="bg-black hover:bg-white text-white hover:text-black py-3 px-6 parent text-2xl border-2 border-black">
                                Home
                            </button>
                        </Link>
                        <Link href="/spotify/playlists">
                            <button className="bg-black hover:bg-white text-white hover:text-black py-3 px-6 parent text-2xl border-2 border-black">
                                Playlists
                            </button>
                        </Link>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handlePlayAllSongs(tracks);
                            }}
                            className="bg-black hover:bg-white text-white hover:text-black py-3 px-6 parent text-2xl border-2 border-black"
                        >
                            Play All
                        </button>
                    </div>
                    <h1>{playlistName}</h1>
                    <div className={styles.AllTracks}>
                        {tracks.length > 0
                            ? tracks.map((track) => {
                                  return (
                                      <EachTrack
                                          track={track.track}
                                          key={track.track.id}
                                      />
                                  );
                              })
                            : !loading && <h1>No songs in this playlist..</h1>}
                    </div>
                </div>
            ) : (
                <SpotifyNotLoggedIn />
            )}
        </Layout>
    );
}

export default SinglePlaylistPage;
