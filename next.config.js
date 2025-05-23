/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['*.ngrok-free.app'],
    // Ensure that the webhook route is properly handled
    async rewrites() {
        return [
            {
                source: '/api/webhook/polar',
                destination: '/api/webhook/polar',
            },
        ];
    },
};

module.exports = nextConfig;
