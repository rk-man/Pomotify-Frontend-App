import SpotifyContext from "contexts/spotifyContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, FRONTEND_URL } from "../config";
import { parseCookies } from "../helpers";

export default function useSpotifyAuth() {
    const { spotifyCode } = useContext(SpotifyContext);

    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [expiresIn, setExpiresIn] = useState("");

    useEffect(() => {
        if (spotifyCode != "") {
            axios
                .post(`${FRONTEND_URL}/api/spotify`, { spotifyCode })
                .then((res) => {
                    // console.log(res.data);
                    setAccessToken(res.data.authDetails.accessToken);
                    setRefreshToken(res.data.authDetails.refreshToken);
                    setExpiresIn(res.data.authDetails.expiresIn);
                });
        }
    }, [spotifyCode]);

    useEffect(() => {
        if (!refreshToken || !expiresIn) {
            return;
        }
        const timeout = setTimeout(() => {
            axios
                .post(`${FRONTEND_URL}/api/spotify/refresh-token`, {
                    refreshToken,
                })
                .then((res) => {
             
                    setAccessToken(res.data.authDetails.accessToken);
                    setRefreshToken(res.data.authDetails.refreshToken);
                    setExpiresIn(res.data.authDetails.expiresIn);
                });
        }, (expiresIn - 60) * 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [refreshToken, expiresIn]);

    return accessToken;
}
