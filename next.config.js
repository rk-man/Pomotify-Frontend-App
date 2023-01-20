/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:8080/:path*", // Proxy to Backend
            },
        ];
    },

    images: {
        domains: ["res.cloudinary.com"],
    },

    eslint: {
        ignoreDuringBuilds: true,
    },

    env: {
        CLIENT_ID: "03ff374ab7594889a1fdb03749eec1b2",
        CLIENT_SECRET: "1f8ad4f8432a4d74ad8f0f2be48dc09b",
        REDIRECT_URI: "https://pomotify-app.vercel.app/spotify",
    },
};

module.exports = nextConfig;
