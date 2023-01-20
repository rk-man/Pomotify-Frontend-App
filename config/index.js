export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3000";

export const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;
