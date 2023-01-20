import axios from "axios";
import { parseCookies } from "@/helpers/index";
import { BACKEND_URL } from "@/config/index";

export default async function editPomo(req, res) {
    if (req.method == "PATCH") {
        const { token } = parseCookies(req);
        if (!token) {
            return res.status(403).json({
                message: "unauthorized...forbidden error",
            });
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const backendRes = await axios.patch(
                `${BACKEND_URL}/api/v1/pomos/${req.body.slug}`,
                req.body,
                config
            );

            return res.status(200).json({
                pomo: backendRes.data.data.pomo,
            });
        } catch (err) {
            return res.status(err.response.status).json({
                err: err.response.data,
                message: err.response.data.message,
            });
        }
    } else {
        res.setHeader("Allow", ["PATCH"]);
        res.status(405).json({
            message: `${req.method} Method Not Allowed`,
        });
    }
}
