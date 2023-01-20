import React, { useContext, useEffect, useState } from "react";
import styles from "@/styles/Spotify.module.css";
import SpotifyPlayer from "react-spotify-web-playback";
import SpotifyContext from "./../contexts/spotifyContext";

function MusicPlayer() {
    const { accessToken, play, setPlay, selectedSongs, setSelectedSongs } =
        useContext(SpotifyContext);

    useEffect(() => {
        setPlay(true);
    }, [selectedSongs]);

    useEffect(() => {
        setPlay(true);
    }, [accessToken]);

    return (
        <div className={styles.spotifyPlayer}>
            <SpotifyPlayer
                token={accessToken}
                showSaveIcon
                uris={
                    selectedSongs && selectedSongs.length > 0
                        ? selectedSongs
                        : []
                }
                initialVolume={0.2}
                play={play}
                callback={(state) => {
                    if (!state.isPlaying) setPlay(false);
                }}
                styles={{
                    bgColor: "black",
                    color: "white",
                    trackNameColor: "white",
                    trackArtistColor: "#cccccc",
                    height: "5rem",
                    sliderColor: "#00ffaa",
                }}
                persistDeviceSelection
            />
        </div>
    );
}

export default MusicPlayer;
