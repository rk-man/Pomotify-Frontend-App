import React from "react";
import styles from "@/styles/Spotify.module.css";
import { FaPlay } from "react-icons/fa";
import { useRouter } from "next/router";

function EachPlaylist({ playlist }) {
    const router = useRouter();
    const handleViewPlaylist = (e) => {
        e.preventDefault();
        router.push(`/spotify/playlists/${playlist.id}`);
    };

    return (
        <div onClick={handleViewPlaylist} className={styles.EachPlaylist}>
            <div className={styles.overlay}></div>
            <p>{playlist.name}</p>
        </div>
    );
}

export default EachPlaylist;
