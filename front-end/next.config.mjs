/** @type {import('next').NextConfig} */
const nextConfig = {
    env :{
        WALLETCONNECT_PROJECT_ID: "31b30e21538fadb8c54ec9f9c614e3e2",
    },
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config) => {
      config.resolve.fallback = {
        fs: false
      }
      return config
    }

    
};

export default nextConfig;
