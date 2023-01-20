import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import MusicPlayer from "@/components/MusicPlayer";

const SpotifyContext = createContext();

export const SpotifyProvider = ({ children }) => {
    const router = useRouter();
    const [selectedSongs, setSelectedSongs] = useState(null);

    const code = router.query.code || "";

    const [spotifyCode, setSpotifyCode] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [expiresIn, setExpiresIn] = useState(0);
    const [expiredAt, setExpiredAt] = useState(0);
    const [secsRem, setSecRem] = useState(0);
    const [play, setPlay] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("code")) {
            setSpotifyCode(localStorage.getItem("code"));
        } else if (code) {
            localStorage.setItem("code", code);
            setSpotifyCode(code);
        }
        return () => {
            setSpotifyCode("");
        };
    }, [code]);

    useEffect(() => {
        setSelectedSongs(
            JSON.parse(localStorage.getItem("playingTrack")) || null
        );
        setAccessToken(localStorage.getItem("accessToken") || "");
        setRefreshToken(localStorage.getItem("refreshToken") || "");
        setExpiresIn(JSON.parse(localStorage.getItem("expiresIn")) || "");

        if (localStorage.getItem("expiredAt")) {
            setExpiredAt(
                new Date(
                    JSON.parse(localStorage.getItem("expiredAt")).expiredAt
                )
            );
        }
    }, []);

    useEffect(() => {
        if (expiredAt) {
            setSecRem(expiredAt - Date.now());
        }
    }, [expiredAt]);

    useEffect(() => {
        if (!refreshToken || !expiresIn || !expiredAt || secsRem === 0) {
            return;
        }

        const interval = setInterval(
            () => {
                console.log("refreshing token");
                axios
                    .post(`/api/spotify/refresh-token`, {
                        refreshToken,
                    })
                    .then((res) => {
                        setAccessToken(res.data.authDetails.accessToken);
                        setExpiresIn(res.data.authDetails.expiresIn);
                        localStorage.setItem(
                            "accessToken",
                            res.data.authDetails.accessToken
                        );

                        localStorage.setItem(
                            "expiresIn",
                            res.data.authDetails.expiresIn
                        );
                        let toBeExpiredAt = new Date();
                        toBeExpiredAt.setSeconds(3500);
                        setExpiredAt(toBeExpiredAt);
                        localStorage.setItem(
                            "expiredAt",
                            JSON.stringify({
                                expiredAt: toBeExpiredAt,
                            })
                        );

                        // window.location.reload();
                    })
                    .catch((err) => {
                        router.push("/spotify");
                    });
            },
            secsRem - 60000 > 10000 ? secsRem - 60000 : 100
        );

        return () => {
            clearInterval(interval);
        };
    }, [refreshToken, expiresIn, expiredAt, secsRem]);

    const getAccessToken = (e) => {
        e.preventDefault();
        if (spotifyCode.length > 10) {
            axios.post(`/api/spotify`, { spotifyCode }).then((res) => {
                // console.log(res.data);
                setAccessToken(res.data.authDetails.accessToken);
                setRefreshToken(res.data.authDetails.refreshToken);
                setExpiresIn(res.data.authDetails.expiresIn);
                localStorage.setItem(
                    "accessToken",
                    res.data.authDetails.accessToken
                );
                localStorage.setItem(
                    "refreshToken",
                    res.data.authDetails.refreshToken
                );
                localStorage.setItem(
                    "expiresIn",
                    res.data.authDetails.expiresIn
                );
                let toBeExpiredAt = new Date();
                toBeExpiredAt.setSeconds(3500);
                setExpiredAt(toBeExpiredAt);
                localStorage.setItem(
                    "expiredAt",
                    JSON.stringify({
                        expiredAt: toBeExpiredAt,
                    })
                );
                setSecRem(toBeExpiredAt - Date.now());
            });
        }
    };

    const handleReconnectSpotify = (e) => {
        e.preventDefault();
        localStorage.removeItem("code");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expiresIn");
        localStorage.removeItem("expiredAt");
        setSpotifyCode("");
        setAccessToken("");
        setExpiresIn("");
        router.push("/spotify");
    };

    // PLAYING ALL SONGS
    const handlePlayAllSongs = (allSongs) => {
        if (allSongs.length <= 0) return;

        let songs = allSongs.map((song) => {
            return song.track.uri;
        });

        setSelectedSongs(songs);
    };

    return (
        <SpotifyContext.Provider
            value={{
                spotifyCode,
                refreshToken,
                accessToken,
                expiresIn,
                getAccessToken,
                handleReconnectSpotify,
                selectedSongs,
                setSelectedSongs,
                handlePlayAllSongs,
                play,
                setPlay,
            }}
        >
            <>
                {children}
                {accessToken && <MusicPlayer />}
            </>
        </SpotifyContext.Provider>
    );
};

export default SpotifyContext;
