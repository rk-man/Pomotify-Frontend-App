import styles from "@/styles/Spotify.module.css";
import SpotifyContext from "./../contexts/spotifyContext";
import { useContext } from "react";
import { FaPlay } from "react-icons/fa";

export default function EachTrack({ track }) {
    const { setSelectedSongs, selectedSongs } = useContext(SpotifyContext);

    const handleSelectingSong = (e) => {
        e.preventDefault();
        setSelectedSongs([track.uri]);
        localStorage.setItem("playingTrack", JSON.stringify([track.uri]));
    };

    return (
        <div onClick={handleSelectingSong} className={styles.EachTrack}>
            <div className={styles.overlay}></div>
            <div className="relative">
                <img
                    src={track.album.images[1].url}
                    className={styles.trackImg}
                />
                <FaPlay className={styles.playBtn} />
            </div>

            <div className="flex flex-col gap-4 items-center justify-center px-2 py-6">
                <p>{track.name}</p>
                <p className="text-gray-400">
                    {track.artists
                        .map((artist) => {
                            return artist.name;
                        })
                        .join(", ")}
                </p>
            </div>
        </div>
    );
}
