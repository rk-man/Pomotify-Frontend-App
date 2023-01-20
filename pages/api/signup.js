import { BACKEND_URL } from "config";
import axios from "axios";
import cookie from "cookie";

export default async function signup(req, res) {
    if (req.method == "POST") {
       

        try {
            const backendRes = await axios.post(
                `${BACKEND_URL}/api/v1/users/signup`,
                req.body
            );

            const { user, token } = backendRes.data.data;
            //SETTING SERVER SIDE COOKIES
            res.setHeader(
                "Set-Cookie",
                cookie.serialize("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: 30 * 24 * 60 * 60,
                    sameSite: "strict",
                    path: "/",
                })
            );

            return res.status(200).json({
                user,
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
