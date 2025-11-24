/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            net: false,
            tls: false,
            crypto: false,
            stream: false,
            url: false,
            zlib: false,
            http: false,
            https: false,
        };
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    // Add empty turbopack config to avoid Turbopack vs webpack conflict
    turbopack: {},
};

module.exports = nextConfig;
