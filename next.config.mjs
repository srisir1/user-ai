/** @type {import('next').NextConfig} */
const nextConfig = {
        reactStrictMode: true,
        env:{
                HOST:"https://chat-server-mocha.vercel.app"
                // HOST:"http://localhost:4000",
        }
};

export default nextConfig;
