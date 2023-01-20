import Layout from "@/components/Layout";
import AuthContext from "contexts/authContext";
import SpotifyContext from "contexts/spotifyContext";
import React, { useContext, useEffect, useState } from "react";
import SpotifyNotLoggedIn from "@/components/SpotifyNotLoggedIn";
import styles from "@/styles/Spotify.module.css";
import EachTrack from "@/components/EachTrack";
import SpotifyWebApi from "spotify-web-api-node";
import Link from "next/link";
import LoadingSpinner from "@/utils/LoadingSpinner";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
});

function LikedSongsPage() {
    const { user } = useContext(AuthContext);
    const { accessToken, setSelectedSongs, handlePlayAllSongs } =
        useContext(SpotifyContext);
    const [likedSongs, setLikedSongs] = useState([]);
    const [spotifyUsername, setSpotifyUsername] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (accessToken) {
            spotifyApi.setAccessToken(accessToken);
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            spotifyApi.getMe().then((data) => {
                setSpotifyUsername(data.body.id);
            });
        }
    }, [accessToken]);

    useEffect(() => {
        if (spotifyUsername) {
            spotifyApi
                .getMySavedTracks({ limit: 50 })
                .then((data) => {
                    setLikedSongs(data.body.items);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [spotifyUsername]);

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
                                Playlist
                            </button>
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handlePlayAllSongs(likedSongs);
                            }}
                            className="bg-black hover:bg-white text-white hover:text-black py-3 px-6 parent text-2xl border-2 border-black"
                        >
                            Play All
                        </button>
                    </div>
                    <div className={styles.AllTracks}>
                        {likedSongs.length > 0
                            ? likedSongs.map((song) => {
                                  return (
                                      <EachTrack
                                          track={song.track}
                                          key={song.track.id}
                                      />
                                  );
                              })
                            : !loading && <h1>No Liked songs here..</h1>}
                    </div>
                </div>
            ) : (
                <SpotifyNotLoggedIn />
            )}
        </Layout>
    );
}

export default LikedSongsPage;
