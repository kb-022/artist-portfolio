const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
    throw new Error('VITE_API_URL is not defined — check your .env file');
}

const config = {
    apiUrl,
} as const;

export default config;