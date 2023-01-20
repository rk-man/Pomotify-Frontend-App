import axios from "axios";
import { parseCookies } from "@/helpers/index";
import { BACKEND_URL } from "@/config/index";

export default async function userPomos(req, res, next) {
    if (req.method == "GET") {
        const { token } = parseCookies(req);

        if (!token) {
            return res.status(403).json({
                message: "unauthorized Error",
            });
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const backendRes = await axios.get(
                `${BACKEND_URL}/api/v1/pomos`,
                config
            );

            return res.status(200).json({
                pomos: backendRes.data.data.pomos,
            });
        } catch (err) {
            
            return res.status(err.response.status || 500).json({
                error: err.response.data,
                message: err.response.data.message,
            });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({
            message: `${req.method} Method Not Allowed`,
        });
    }
}
