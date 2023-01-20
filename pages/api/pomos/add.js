import { BACKEND_URL } from "@/config/index";
import { parseCookies } from "@/helpers/index";
import axios from "axios";

export default async function addPomo(req, res) {
    if (req.method === "POST") {
        const { token } = parseCookies(req);

        if (!token) {
            return res.status(403).json({
                message: "unauthorized...forbidden",
            });
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const backendRes = await axios.post(
                `${BACKEND_URL}/api/v1/pomos`,
                req.body,
                config
            );

            return res.status(201).json({
                pomo: backendRes.data.data.pomo,
            });
        } catch (err) {
            return res.status(err.response.status).json({
                err: err.response.data ? err.response.data : err.response,
                message: err.response.data
                    ? err.response.data.message
                    : "Something went wrong",
            });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({
            message: `${req.method} Method Not Allowed`,
        });
    }
}
