import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Spotify.module.css";
import SpotifyContext from "contexts/spotifyContext";
import AuthContext from "./../../../contexts/authContext";
import { useContext } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import EachPlaylist from "@/components/EachPlaylist";
import SpotifyNotLoggedIn from "@/components/SpotifyNotLoggedIn";
import Link from "next/link";
import LoadingSpinner from "@/utils/LoadingSpinner";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
});

function PlaylistsPage() {
    const { user } = useContext(AuthContext);
    const { accessToken } = useContext(SpotifyContext);
    const [playlists, setPlaylists] = useState([]);

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
            spotifyApi.getUserPlaylists(spotifyUsername).then((data) => {
           
                setPlaylists(data.body.items);
                setLoading(false);
            }).catch((err)=>{
                console.log(err)
            })
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
                        <Link href="/spotify/liked-songs">
                            <button className="bg-black hover:bg-white text-white hover:text-black py-3 px-6 parent text-2xl border-2 border-black">
                                Liked Songs
                            </button>
                        </Link>
                    </div>

                    <div className={styles.AllPlaylists}>
                        {playlists.length > 0
                            ? playlists.map((playlist) => {
                                  return (
                                      <EachPlaylist
                                          key={playlist.id}
                                          playlist={playlist}
                                      />
                                  );
                              })
                            : !loading && <h1>No playlists so far</h1>}
                    </div>
                </div>
            ) : (
                !loading && <SpotifyNotLoggedIn />
            )}
        </Layout>
    );
}

export default PlaylistsPage;
