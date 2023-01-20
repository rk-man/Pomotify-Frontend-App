import { BACKEND_URL } from "@/config/index";
import { parseCookies } from "@/helpers/index";
import axios from "axios";
import React from "react";

export default async function uploadProfileImage(req, res) {
    if (req.method === "POST") {
        const { token } = parseCookies(req);
    

        if (!token) {
            return res.status(403).json({
                message: "Unauthorized...forbidden request",
            });
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const backendRes = await axios.patch(
                `${BACKEND_URL}/api/v1/users/${req.body.username}/upload-profile-image`,
                { uploadingFile: req.body.file },
                config
            );

       

            return res.status(200).json({
                user: backendRes.data.data.user,
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
