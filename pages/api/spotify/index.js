import { BACKEND_URL } from "@/config/index";
import { parseCookies } from "@/helpers/index";
import axios from "axios";

export default async function requestAccessToken(req, res) {
    if (req.method === "POST") {
        const { token } = parseCookies(req);

        if (!token) {
            return res.status(403).json({
                message: "forbidden..User not logged in",
            });
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const backendRes = await axios.post(
                `${BACKEND_URL}/api/v1/spotify/request-access-token`,
                {
                    code: req.body.spotifyCode,
                },
                config
            );

          

            return res.status(200).json({
                authDetails: backendRes.data,
            });
        } catch (err) {
            return res.status(err.response.status || 500).json({
                error: err.response.data,
                message: err.response.data.message,
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({
            message: `${req.method} Method Not Allowed`,
        });
    }
}
