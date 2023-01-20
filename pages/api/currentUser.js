import { BACKEND_URL } from "config";
import cookie from "cookie";
import axios from "axios";

export default async function currentUser(req, res) {
    if (req.method == "GET") {
        if (!req.headers.cookie) {
            res.status(403).json({
                message: "User not logged in..unauthorized..login to continue",
            });

            return;
        } else {
            const { token } = cookie.parse(req.headers.cookie);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const backendRes = await axios.get(
                `${BACKEND_URL}/api/v1/users/me`,
                config
            );

            return res.status(200).json({
                data: backendRes.data.data.user,
            });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ message: `${req.method} Method Not Allowed` });
    }
}
