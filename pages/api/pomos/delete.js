import axios from "axios";
import { parseCookies } from "@/helpers/index";
import { BACKEND_URL } from "@/config/index";

export default async function deletePomo(req, res) {
    if (req.method == "POST") {
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
            await axios.delete(
                `${BACKEND_URL}/api/v1/pomos/${req.body.slug}`,
                config
            );

            return res.status(200).json({
                pomo: null,
                message: "successfully deleted pomo",
            });
        } catch (err) {
            return res.status(err.response.status).json({
                err: err.response.data,
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
